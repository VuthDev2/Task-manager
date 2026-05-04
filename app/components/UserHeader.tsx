"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';
import { Search, Bell, X, Folder, CheckSquare } from 'lucide-react';
import { getUnreadCount } from '@/app/lib/notification-actions';

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  email?: string;
  avatar_url: string | null;
  position: string | null;
}

interface UserHeaderProps {
  title: string;
}

interface Suggestion {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  project_name?: string;
  type: 'task' | 'category';
}

export default function UserHeader({ title }: UserHeaderProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imgError, setImgError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch profile and unread count
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, avatar_url, position')
        .eq('id', user.id)
        .single();
      if (!error && data) setProfile(data);
    };
    fetchProfile();
    const updateCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    updateCount();
  }, []);

  // Real‑time profile updates
  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${profile.id}` }, (payload) => {
        setProfile(payload.new as Profile);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile?.id]);

  // Real‑time notifications
  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` }, () => {
        setUnreadCount(prev => prev + 1);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` }, async () => {
        const count = await getUnreadCount();
        setUnreadCount(count);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile?.id]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        const combined: Suggestion[] = [
          ...data.tasks.map((t: any) => ({ ...t, type: 'task' as const })),
          ...data.categories.map((c: any) => ({ ...c, type: 'category' as const })),
        ];
        setSuggestions(combined);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/user/user-search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'task') {
      router.push('/user/user-tasks');
    } else {
      router.push('/user/user-cate');
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile?.email) return profile.email[0].toUpperCase();
    return 'U';
  };

  return (
    <header className="flex flex-col gap-4 mb-8 sm:mb-10 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
        {/* Search with suggestions */}
        <div className="relative w-full sm:w-auto" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              placeholder="Search..."
              className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-full sm:w-72 border-none shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading...</div>
              ) : suggestions.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No results</div>
              ) : (
                <>
                  {suggestions.slice(0, 5).map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="p-2 rounded-lg bg-indigo-50">
                        {item.type === 'task' ? (
                          <CheckSquare size={16} className="text-indigo-500" />
                        ) : (
                          <Folder size={16} className="text-indigo-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">
                          {item.type === 'task' ? item.title : item.name}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {item.type === 'task'
                            ? item.description || 'No description'
                            : item.project_name || 'No project'}
                        </p>
                      </div>
                    </button>
                  ))}
                  {suggestions.length > 5 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-sm text-indigo-600 hover:bg-indigo-50 font-medium"
                    >
                      See all results ({suggestions.length})
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <Link href="/user/user-notification" className="relative cursor-pointer hover:scale-110 transition-transform p-2 bg-white rounded-full shadow-sm self-start sm:self-auto">
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Clickable profile */}
        <Link href="/user/user-setting" className="flex items-center gap-3 border-gray-200 hover:opacity-80 transition-opacity sm:border-l sm:pl-6">
          <div className="text-left sm:text-right">
            <p className="text-sm font-black text-gray-900">{profile?.full_name || 'User'}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
              {profile?.position || 'Add job title'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-gray-800">
            {profile?.avatar_url && !imgError ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
