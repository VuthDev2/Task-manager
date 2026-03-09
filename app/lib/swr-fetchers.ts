import { getUserTasks } from './task-actions';
import { getUserCategories } from './category-actions';
import { getAllUsers } from './user-actions';
import { getUserNotifications, getUnreadCount } from './notification-actions';
import { createClient } from '@/src/utils/supabase/client';

// Keys for SWR cache
export const SWR_KEYS = {
  tasks: 'tasks',
  categories: 'categories',
  users: 'users',
  notifications: 'notifications',
  unreadCount: 'unreadCount',
  profile: (userId: string) => `profile-${userId}`,
};

// Fetcher functions (these are already server actions – they work on client too)
export const fetchers = {
  tasks: getUserTasks,
  categories: getUserCategories,
  users: getAllUsers,
  notifications: getUserNotifications,
  unreadCount: getUnreadCount,
  profile: async (userId: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, email, avatar_url, position')
      .eq('id', userId)
      .single();
    return data;
  },
};