"use client";
import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import UserHeader from '@/app/components/UserHeader';
import { 
  Search, Plus, Pencil, Trash2, X, ChevronDown,
  Folder, Briefcase, User, Globe, Code, ShoppingBag
} from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/app/lib/category-actions';
import { getUserTasks } from '@/app/lib/task-actions';

interface Category {
  id: number;
  name: string;
  icon: string;
  project_name: string | null;
  description: string | null;
  color: string;
  created_by: string;
}

interface Task {
  id: number;
  category: string | null;
}

// Emoji fallback for each icon
const iconEmojis: Record<string, string> = {
  Folder: '📁',
  Briefcase: '💼',
  User: '👤',
  Globe: '🌐',
  Code: '💻',
  ShoppingBag: '🛍️',
};

// Map Tailwind color classes to actual hex values
const colorMap: Record<string, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-indigo-500': '#6366f1',
  'bg-purple-500': '#a855f7',
  'bg-green-500': '#22c55e',
  'bg-yellow-500': '#eab308',
  'bg-orange-500': '#f97316',
  'bg-red-500': '#ef4444',
  'bg-pink-500': '#ec4899',
};

export default function CategoriesClient({ 
  initialCategories, 
  initialTasks 
}: { 
  initialCategories: Category[]; 
  initialTasks: Task[]; 
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const refreshTaskCounts = async () => {
    try {
      const updatedTasks = await getUserTasks();
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to refresh tasks', err);
    }
  };

  const handleDelete = async (id: number) => {
    const category = categories.find(c => c.id === id);
    const taskCount = tasks.filter(t => t.category === category?.name).length;
    if (taskCount > 0) {
      if (!confirm(`This category is used by ${taskCount} task(s). Deleting it will set those tasks to uncategorized. Continue?`)) {
        return;
      }
    } else {
      if (!confirm('Delete this category?')) return;
    }
    try {
      const result = await deleteCategory(id);
      if (result?.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        await refreshTaskCounts();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      const result = await createCategory(formData);
      if (result?.category) {
        setCategories(prev => [result.category, ...prev]);
        await refreshTaskCounts();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingCategory) return;
    try {
      const result = await updateCategory(editingCategory.id, formData);
      if (result?.category) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? result.category : c));
        await refreshTaskCounts();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const taskCounts: Record<string, number> = {};
  tasks.forEach(task => {
    if (task.category) {
      taskCounts[task.category] = (taskCounts[task.category] || 0) + 1;
    }
  });

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <UserHeader title="Categories" />

        
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span className="font-black">New Category</span>
          </button>
         
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 font-black text-gray-400 italic">
            No categories yet. Create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const taskCount = taskCounts[cat.name] || 0;
              const iconColor = colorMap[cat.color] || '#000';
              const emoji = iconEmojis[cat.icon] || '📁';

              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 relative overflow-hidden group"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cat.color}`} />

                  <div 
                    className={`p-3 rounded-xl ${cat.color} bg-opacity-10 flex items-center justify-center w-12 h-12 mb-3`}
                    style={{ color: iconColor }}
                  >
                    <span className="text-2xl">{emoji}</span>
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {cat.project_name && (
                    <p className="text-sm font-semibold text-gray-700 mb-1">{cat.project_name}</p>
                  )}
                  {cat.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{cat.description}</p>
                  )}
                  
                  <div className="mt-2 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Tasks using this category</span>
                    <span className="font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                      {taskCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}

function CategoryModal({ category, onClose, onSubmit }: any) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  const colors = [
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500'
  ];

  const icons = ['Folder', 'Briefcase', 'User', 'Globe', 'Code', 'ShoppingBag'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">{category ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            defaultValue={category?.name || ''}
            placeholder="Category name"
            required
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <input
            name="project_name"
            defaultValue={category?.project_name || ''}
            placeholder="Project name (optional)"
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <textarea
            name="description"
            defaultValue={category?.description || ''}
            placeholder="Description (optional)"
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Color</label>
              <select name="color" defaultValue={category?.color || 'bg-blue-500'} className="w-full p-3 border border-gray-200 rounded-xl">
                {colors.map(c => (
                  <option key={c} value={c}>{c.replace('bg-', '').replace('-500', '')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Icon</label>
              <select name="icon" defaultValue={category?.icon || 'Folder'} className="w-full p-3 border border-gray-200 rounded-xl">
                {icons.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            {category ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
}