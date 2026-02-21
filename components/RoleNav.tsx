'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../src/utils/supabase/client' // Correct import
import { Session, User } from '@supabase/supabase-js';

// Define proper types
interface Profile {
  id: string;
  role: 'user' | 'admin';
  username?: string;
  email?: string;
}

export function RoleNav() {
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error('Failed to get session: ' + sessionError.message);
        }

        if (!session) {
          setLoading(false);
          return;
        }

        // Get profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          throw new Error('Failed to fetch profile: ' + profileError.message);
        }

        setRole(profile.role);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('RoleNav error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [supabase]);

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <span className="text-red-500">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Handle no session
  if (role === null) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="font-bold text-lg">
              {role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Admin-specific links */}
            {role === 'admin' && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Users
                </button>
                <button 
                  onClick={() => router.push('/admin/analytics')}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Analytics
                </button>
              </div>
            )}
            
            {/* Common links */}
            <button 
              onClick={() => router.push('/settings')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Settings
            </button>
            
            {/* Logout */}
            <form 
              action={async () => {
                'use server';
                const { logout } = await import('@/app/lib/auth-actions');
                await logout();
              }}
            >
              <button 
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}