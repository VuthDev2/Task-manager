'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;

  // Update email in auth (will send confirmation email)
  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) throw new Error(emailError.message);
  }

  // Update profile in public.profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (profileError) throw new Error(profileError.message);

  revalidatePath('/user/user-setting');
}