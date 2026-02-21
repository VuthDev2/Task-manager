"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/src/utils/supabase/client';
import { Search, Bell } from 'lucide-react';
import { getUnreadCount } from '@/app/lib/notification-actions';

interface Profile {
  id: string;                // added id
  full_name: string | null;
  role: string | null;
  email?: string;
  avatar_url: string | null;
}

interface UserHeaderProps {
  title: string;
}

export default function UserHeader({ title }: UserHeaderProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imgError, setImgError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  // Fetch profile and initial unread count
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, avatar_url')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    };
    fetchProfile();

    // Get initial unread count
    const updateCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    updateCount();
  }, []);

  // Real‑time subscription for new notifications
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          // New notification arrived – increment count
          setUnreadCount(prev => prev + 1);
          // Optional: show a toast notification
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        async () => {
          // If a notification was marked read, we should refresh the count
          const count = await getUnreadCount();
          setUnreadCount(count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (profile?.email) return profile.email[0].toUpperCase();
    return 'U';
  };

  const avatarSrc = profile?.avatar_url || '/avatar.png';

  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
      <div className="flex items-center gap-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
          />
        </div>
        {/* Notification bell with live badge */}
        <Link href="/user/user-notification" className="relative cursor-pointer hover:scale-110 transition-transform p-2 bg-white rounded-full shadow-sm">
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        {/* Profile section */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-black text-gray-900">{profile?.full_name || 'User'}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
              {profile?.role === 'admin' ? 'Administrator' : 'Project Manager'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-gray-800">
            {!imgError ? (
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}