"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeder';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Folder, 
  Edit, 
  Trash2, 
  X,
  Check
} from 'lucide-react';
import { getAllCategories, createCategoryAsAdmin, updateCategoryAsAdmin, deleteCategoryAsAdmin } from '@/app/lib/admin-actions';

interface Category {
  id: number;
  name: string;
  icon: string;
  project_name: string | null;
  description: string | null;
  color: string;
  created_by: string;
  profiles?: { email: string };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Tasks using it may break.')) return;
    try {
      await deleteCategoryAsAdmin(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Icon mapping (simplified)
  const iconMap: Record<string, any> = {
    Folder: Folder,
    // add more if needed
  };

  return (
    <div className="flex min-h-screen bg-[#F6F7FB]">
      <AdminSidebar />
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <AdminHeader title="Categories" />

        <section className="mb-6 rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Taxonomy</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">Keep workspace categories controlled.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
                Admin categories create the shared structure users rely on when assigning and reporting tasks.
              </p>
            </div>
            <button
              onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
            >
              <Plus size={17} />
              New Category
            </button>
          </div>
          <div className="relative mt-6">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories or projects..."
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
            />
          </div>
        </section>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-400">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">No categories found.</div>
          ) : (
            filteredCategories.map((cat) => {
              const IconComp = iconMap[cat.icon] || Folder;
              return (
                <div
                  key={cat.id}
                  className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${cat.color} bg-opacity-10`}>
                      <IconComp className={`w-6 h-6 ${cat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-950 mb-2">{cat.name}</h3>
                  <p className="text-sm font-semibold text-gray-700">{cat.project_name || '—'}</p>
                  <p className="text-xs text-gray-500 mt-2">{cat.description || 'No description'}</p>
                  <div className="mt-6 pt-4 border-t border-gray-50 text-xs text-gray-400">
                    Created by: {cat.profiles?.email || 'Unknown'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (formData: FormData) => {
            try {
              if (editingCategory) {
                await updateCategoryAsAdmin(editingCategory.id, formData);
              } else {
                await createCategoryAsAdmin(formData);
              }
              await fetchCategories();
              setIsModalOpen(false);
            } catch (err: any) {
              alert(err.message);
            }
          }}
        />
      )}
    </div>
  );
}

// Modal Component (design matches your task modal)
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
            defaultValue={category?.name}
            placeholder="Category name"
            required
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <input
            name="project_name"
            defaultValue={category?.project_name || ''}
            placeholder="Project name"
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <textarea
            name="description"
            defaultValue={category?.description || ''}
            placeholder="Description"
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Color</label>
              <select name="color" defaultValue={category?.color || 'bg-blue-500'} className="w-full p-3 border border-gray-200 rounded-xl">
                {colors.map(c => (
                  <option key={c} value={c}>{c.replace('bg-', '').replace('-500', '')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Icon</label>
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
