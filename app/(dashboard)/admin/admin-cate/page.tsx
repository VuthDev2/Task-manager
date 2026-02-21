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
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <AdminHeader title="Categories" />

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white hover:shadow-xl transition-all group"
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
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