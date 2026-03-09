'use server';

import { createClient } from '@/src/utils/supabase/server';

export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .order('full_name');
  if (error) throw new Error(error.message);
  return data;
}