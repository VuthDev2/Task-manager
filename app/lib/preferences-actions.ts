'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPreferences() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updatePreferences(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const preferences = {
    language: formData.get('language'),
    timezone: formData.get('timezone'),
    date_format: formData.get('date_format'),
    first_day_of_week: parseInt(formData.get('first_day_of_week') as string),
    theme: formData.get('theme'),
    compact_view: formData.get('compact_view') === 'on',
    email_task_assigned: formData.get('email_task_assigned') === 'on',
    email_task_due: formData.get('email_task_due') === 'on',
    email_summary: formData.get('email_summary') === 'on',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: user.id, ...preferences }, { onConflict: 'user_id' });

  if (error) throw error;
  revalidatePath('/user/user-setting');
}

export async function getUserTheme() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'light'; // default

  const { data, error } = await supabase
    .from('user_preferences')
    .select('theme')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return 'light';
  return data.theme;
}