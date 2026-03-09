'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ---------- TASKS ----------
export async function getAllTasks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      profiles!tasks_created_by_fkey ( email, full_name )
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createTaskAsAdmin(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const due_date = formData.get('due_date') as string;
  const assigned_to = formData.get('assigned_to') as string;

  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    priority,
    due_date: due_date || null,
    assigned_to,
    created_by: assigned_to,
    status: 'pending',
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-tasks');
  redirect('/admin/admin-tasks');
}

export async function updateTaskAsAdmin(taskId: number, formData: FormData) {
  const supabase = await createClient();
  const updates = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    status: formData.get('status'),
    due_date: formData.get('due_date'),
    assigned_to: formData.get('assigned_to'),
  };
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-tasks');
  redirect('/admin/admin-tasks');
}

export async function deleteTaskAsAdmin(taskId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-tasks');
}

// ---------- USERS ----------
export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-users');
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-users');
}

// ---------- CATEGORIES ----------
export async function getAllCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*, profiles!categories_created_by_fkey ( email )')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createCategoryAsAdmin(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const name = formData.get('name') as string;
  const project_name = formData.get('project_name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;

  const { error } = await supabase.from('categories').insert({
    name,
    project_name,
    description,
    color,
    icon,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-cate');
  redirect('/admin/admin-cate');
}

export async function updateCategoryAsAdmin(categoryId: number, formData: FormData) {
  const supabase = await createClient();
  const updates = {
    name: formData.get('name'),
    project_name: formData.get('project_name'),
    description: formData.get('description'),
    color: formData.get('color'),
    icon: formData.get('icon'),
  };
  const { error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', categoryId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-cate');
  redirect('/admin/admin-cate');
}

export async function deleteCategoryAsAdmin(categoryId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/admin-cate');
}