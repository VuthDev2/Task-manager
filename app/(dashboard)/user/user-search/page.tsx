import { createClient } from '@/src/utils/supabase/server';
import Link from 'next/link';
import { Folder, CheckSquare } from 'lucide-react';
import UserHeader from '@/app/components/UserHeader';
import Sidebar from '../../../components/Sidebar';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div>Not authenticated</div>;

  if (!query) {
    return (
      <div className="flex min-h-screen bg-[#F3F4F9]">
        <Sidebar />
        <main className="flex-1 p-8">
          <UserHeader title="Search" />
          <div className="text-center py-20 text-gray-400">
            Enter a search term above.
          </div>
        </main>
      </div>
    );
  }

  // Search tasks (title, description)
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order('created_at', { ascending: false });

  // Search categories (name, project_name)
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('created_by', user.id)
    .or(`name.ilike.%${query}%,project_name.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  const total = (tasks?.length || 0) + (categories?.length || 0);

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <UserHeader title="Search Results" />

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Found {total} result{total !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {tasks && tasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <CheckSquare size={20} className="text-indigo-500" />
              Tasks ({tasks.length})
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <Link
                  key={task.id}
                  href="/user/user-tasks"
                  className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                >
                  <h3 className="font-black text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Due: {task.due_date || 'No date'}</span>
                    <span>Priority: {task.priority}</span>
                    <span>Status: {task.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <Folder size={20} className="text-indigo-500" />
              Categories ({categories.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href="/user/user-cate"
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                >
                  <h3 className="font-black text-gray-900">{cat.name}</h3>
                  {cat.project_name && (
                    <p className="text-xs text-gray-500 mt-1">{cat.project_name}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 font-black text-gray-400 italic">
            No results found for "{query}"
          </div>
        )}
      </main>
    </div>
  );
}