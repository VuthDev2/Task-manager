import { createClient } from '@/src/utils/supabase/server';
import { getPreferences } from '@/app/lib/preferences-actions';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>Not authenticated</div>;

  const [profileResult, preferences] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, role, email, avatar_url, position')
      .eq('id', user.id)
      .single(),
    getPreferences(),
  ]);

  const profile = profileResult.data || {
    full_name: null,
    email: user.email,
    role: null,
    avatar_url: null,
    position: null,
  };

  return (
    <SettingsClient
      initialProfile={profile}
      initialPreferences={preferences || {
        language: 'en',
        timezone: 'UTC',
        date_format: 'MM/DD/YYYY',
        first_day_of_week: 0,
        theme: 'light',
        compact_view: false,
        email_task_assigned: true,
        email_task_due: true,
        email_summary: false,
      }}
    />
  );
}