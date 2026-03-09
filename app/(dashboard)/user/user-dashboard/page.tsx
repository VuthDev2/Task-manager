import { Suspense } from 'react';
import SuccessFeedback from '@/components/SuccessFeedback';
import { createClient } from '@/src/utils/supabase/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>Not authenticated</div>;

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <>
      <Suspense fallback={null}>
        <SuccessFeedback />
      </Suspense>
      <DashboardClient initialTasks={tasks || []} />
    </>
  );
}