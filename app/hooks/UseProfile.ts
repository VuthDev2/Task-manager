import useSWR from 'swr';
import { createClient } from '@/src/utils/supabase/client';
import { SWR_KEYS } from '@/app/lib/swr-keys';
import { getUnreadCount } from '@/app/lib/notification-actions';

export function useProfile() {
  const supabase = createClient();

  const { data: user } = useSWR('auth-user', async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  });

  const userId = user?.id;

  const { data: profile, mutate: mutateProfile } = useSWR(
    userId ? SWR_KEYS.profile(userId) : null,
    async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, avatar_url, position')
        .eq('id', userId!)
        .single();
      return data;
    },
    { revalidateOnFocus: false }
  );

  const { data: unreadCount = 0, mutate: mutateUnread } = useSWR(
    SWR_KEYS.unreadCount,
    getUnreadCount,
    { refreshInterval: 30000, revalidateOnFocus: false }
  );

  return { profile, unreadCount, mutateProfile, mutateUnread };
}