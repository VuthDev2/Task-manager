import { createClient } from '@/src/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ tasks: [], categories: [] });
  }

  // Search tasks (title, description)
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, description, due_date, priority, status')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .limit(5);

  // Search categories (name, project_name)
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, project_name')
    .eq('created_by', user.id)
    .or(`name.ilike.%${query}%,project_name.ilike.%${query}%`)
    .limit(5);

  return NextResponse.json({
    tasks: tasks || [],
    categories: categories || [],
  });
}