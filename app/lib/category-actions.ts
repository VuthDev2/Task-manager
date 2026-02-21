'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// GET all categories for current user
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

// CREATE a new category
export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const name = formData.get('name') as string;
  const projectName = formData.get('project_name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string || 'bg-blue-500';
  const icon = formData.get('icon') as string || 'Folder';

  const { error } = await supabase.from('categories').insert({
    name,
    project_name: projectName,
    description,
    color,
    icon,
    created_by: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
  redirect('/user/user-cate');
}

// UPDATE a category
export async function updateCategory(categoryId: number, formData: FormData) {
  const supabase = createClient();
  const updates = {
    name: formData.get('name'),
    project_name: formData.get('project_name'),
    description: formData.get('description'),
    color: formData.get('color'),
    icon: formData.get('icon'),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', categoryId);

  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
  redirect('/user/user-cate');
}

// DELETE a category
export async function deleteCategory(categoryId: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) throw new Error(error.message);
  revalidatePath('/user/user-cate');
}

