"use client";
import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Search, Bell, Plus, ChevronDown, X, Trash2, Edit } from 'lucide-react';
import { createTask, updateTask, deleteTask } from '@/app/lib/task-actions';
import UserHeader from '@/app/components/UserHeader';

// Interfaces (keep exactly as before)
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  category: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

// FilterPill component
function FilterPill({ label }: { label: string }) {
  return (
    <div className="bg-white/80 px-4 py-1.5 rounded-xl flex items-center gap-2 text-[13px] font-black text-gray-700 shadow-sm border border-gray-100 pointer-events-none">
      {label} <ChevronDown size={14} className="text-gray-400" />
    </div>
  );
}

export default function TasksClient({
  initialTasks,
  initialCategories,
  initialUsers,
}: {
  initialTasks: Task[];
  initialCategories: Category[];
  initialUsers: User[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [categories] = useState(initialCategories);
  const [users] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Optimistic create
  const handleCreate = async (formData: FormData) => {
    try {
      const result = await createTask(formData);
      if (result?.task) {
        setTasks(prev => [result.task, ...prev]);
        handleCloseModal();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Optimistic update
  const handleUpdate = async (taskId: number, formData: FormData) => {
    try {
      const result = await updateTask(taskId, formData);
      if (result?.task) {
        setTasks(prev => prev.map(t => t.id === taskId ? result.task : t));
        handleCloseModal();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'Hard': return 'bg-purple-500';
      case 'High': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F9] font-sans">
      <Sidebar />
      <main className="flex-1 p-8">
        <UserHeader title="My Tasks" />

        {/* Action Bar */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-800">Tasks list</h2>
              <p className="text-sm font-bold text-gray-500">
                You have {filteredTasks.length} tasks for today
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <span className="font-black">Create Task</span>
              <div className="bg-white/20 p-1 rounded-lg">
                <Plus size={20} />
              </div>
            </button>
          </div>

          {/* Filter pills */}
          <div className="bg-[#D1E9ED]/50 backdrop-blur-sm p-2 rounded-2xl flex items-center gap-3 border border-[#B8DDE3] flex-wrap">
            <div className="flex-1 relative ml-2 min-w-[200px]">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search tasks..."
                className="w-full bg-transparent pl-6 pr-4 py-2 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-500"
              />
            </div>

            {/* Priority filter */}
            <div className="relative">
              <FilterPill label={filterPriority === 'All' ? 'Priority' : filterPriority} />
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                onChange={(e) => setFilterPriority(e.target.value)}
                value={filterPriority}
              >
                <option value="All">All Priority</option>
                <option value="Hard">Hard</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            {/* Category filter */}
            <div className="relative">
              <FilterPill label={filterCategory === 'All' ? 'Category' : filterCategory} />
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="relative">
              <FilterPill label={filterStatus === 'All' ? 'Status' : filterStatus} />
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 px-6 mb-4 text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">
          <div className="col-span-5">Task Details</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 font-black text-gray-400 italic">
              No tasks found. Create one!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => handleDelete(task.id)}
                onEdit={() => handleEdit(task)}
                getPriorityColor={getPriorityColor}
              />
            ))
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          categories={categories}
          users={users}
          onClose={handleCloseModal}
          onSubmit={editingTask ? handleUpdate : handleCreate}
        />
      )}
    </div>
  );
}

// TaskItem component (unchanged from your original)
function TaskItem({ task, onDelete, onEdit, getPriorityColor }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group border border-transparent hover:border-gray-100">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black" />
      <div className="grid grid-cols-12 w-full items-center">
        <div className="col-span-5 pl-6">
          <h4 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
          <p className="text-xs text-gray-400 font-black">{task.description || ''}</p>
        </div>
        <div className="col-span-2 text-center">
          <span className="text-xs font-black text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
            {task.due_date || 'No date'}
          </span>
        </div>
        <div className="col-span-2 flex justify-center">
          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full text-white ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        <div className="col-span-2 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
          #{task.category || 'Uncategorized'}
        </div>
        <div className="col-span-1 flex justify-end gap-2 pr-4">
          <button onClick={onEdit} className="text-gray-300 hover:text-blue-600 transition-colors p-1" title="Edit Task">
            <Edit size={20} />
          </button>
          <button onClick={onDelete} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete Task">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// TaskModal component (updated with min date)
function TaskModal({ task, categories, users, onClose, onSubmit }: any) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-all group">
            <X size={24} strokeWidth={3} className="text-gray-900 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Task Title</label>
            <input
              name="title"
              defaultValue={task?.title || ''}
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 text-lg font-black text-gray-900 outline-none transition-all"
              placeholder="e.g. Design Branding"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Description</label>
            <input
              name="description"
              defaultValue={task?.description || ''}
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 font-black text-gray-700 outline-none transition-all"
              placeholder="Details..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Priority</label>
              <select
                name="priority"
                defaultValue={task?.priority || 'Medium'}
                className="w-full appearance-none bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none cursor-pointer"
              >
                <option>Medium</option>
                <option>High</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Category</label>
              <select
                name="category"
                defaultValue={task?.category || ''}
                className="w-full appearance-none bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none cursor-pointer"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Status</label>
              <select
                name="status"
                defaultValue={task?.status || 'pending'}
                className="w-full appearance-none bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                defaultValue={task?.due_date || ''}
                min={new Date().toISOString().split('T')[0]} // 👈 prevent past dates
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 font-black text-gray-700 outline-none transition-all"
              />
            </div>
          </div>
          {/* Assignee dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Assign to</label>
            <select
              name="assigned_to"
              defaultValue={task?.assigned_to || ''}
              required
              className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 font-black text-gray-700 outline-none transition-all"
            >
              <option value="">Select assignee</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>{user.full_name || user.email}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg mt-4 shadow-xl active:scale-95 transition-all"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}