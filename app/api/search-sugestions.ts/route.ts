import { createClient } from '@/src/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  if (!query || query.length < 2) {
    return NextResponse.json({ tasks: [], categories: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Search tasks (title only for suggestions)
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, description, status, priority, due_date, category')
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(5);

  // Search categories (name only)
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, project_name, color')
    .eq('created_by', user.id)
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(5);

  return NextResponse.json({
    tasks: tasks || [],
    categories: categories || [],
  });
}