'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// GET all tasks for current user
export async function getUserTasks() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Helper to create notifications
async function notifyUser(userId: string, type: string, sender: string, message: string) {
  const supabase = createClient();
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    sender,
    message,
    is_read: false,
  });
}

// CREATE a new task
export async function createTask(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const due_date = formData.get('due_date') as string;
  const assigned_to = formData.get('assigned_to') as string; // read assignee from form

  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    priority,
    due_date: due_date || null,
    created_by: user.id,
    assigned_to: assigned_to || user.id, // default to current user if not provided
    status: 'pending',
  });

  if (error) throw new Error(error.message);

  // Notify the assignee if different from creator
  if (assigned_to && assigned_to !== user.id) {
    await notifyUser(
      assigned_to,
      'task_assigned',
      user.email || 'System',
      `You have been assigned a new task: "${title}"`
    );
  }

  revalidatePath('/user/user-tasks');
  redirect('/user/user-tasks');
}

// DELETE a task
export async function deleteTask(taskId: number) {
  const supabase = createClient();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw new Error(error.message);
  revalidatePath('/user/user-tasks');
}

// UPDATE a task
export async function updateTask(taskId: number, formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get current task to know who it's assigned to
  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('assigned_to, title')
    .eq('id', taskId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const status = formData.get('status') as string;
  const due_date = formData.get('due_date') as string;
  const category = formData.get('category') as string;
  const newAssignee = formData.get('assigned_to') as string;

  const updates: any = {
    title,
    description,
    priority,
    status,
    due_date: due_date || null,
    category: category || null,
    updated_at: new Date().toISOString(),
  };

  // If assignee field is provided, include it
  if (newAssignee) {
    updates.assigned_to = newAssignee;
  }

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) throw new Error(error.message);

  // Notify logic
  // If assignee changed and new assignee is different from creator
  if (newAssignee && newAssignee !== task.assigned_to) {
    await notifyUser(
      newAssignee,
      'task_assigned',
      user.email || 'System',
      `You have been assigned a task: "${title}"`
    );
  } else if (task.assigned_to && task.assigned_to !== user.id) {
    // Notify current assignee (if not the updater) that task was updated
    await notifyUser(
      task.assigned_to,
      'task_updated',
      user.email || 'System',
      `Task "${title}" has been updated.`
    );
  }

  revalidatePath('/user/user-tasks');
  redirect('/user/user-tasks');
}