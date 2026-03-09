import { createClient } from '@/src/utils/supabase/server';
import { getUserCategories } from '@/app/lib/category-actions';
import { getAllUsers } from '@/app/lib/user-actions';
import TasksClient from './TasksClient';

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>Not authenticated</div>;

  const [tasks, categories, users] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .then(res => res.data || []),
    getUserCategories(),
    getAllUsers(),
  ]);

  return (
    <TasksClient
      initialTasks={tasks}
      initialCategories={categories}
      initialUsers={users}
    />
  );
}