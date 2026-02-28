'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserCategories() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const name = formData.get('name') as string;
  const project_name = formData.get('project_name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, project_name, description, color, icon, created_by: user.id })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
  return { success: true, category: data };
}

export async function updateCategory(categoryId: number, formData: FormData) {
  const supabase = createClient();
  const updates = {
    name: formData.get('name'),
    project_name: formData.get('project_name'),
    description: formData.get('description'),
    color: formData.get('color'),
    icon: formData.get('icon'),
  };
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
  return { success: true, category: data };
}

export async function deleteCategory(categoryId: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
  return { success: true, id: categoryId };
}
