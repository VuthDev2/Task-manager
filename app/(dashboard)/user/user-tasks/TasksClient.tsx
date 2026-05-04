"use client";
import React, { useMemo, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { CalendarDays, CheckCircle2, Clock3, Edit, ListFilter, Plus, Search, Trash2, X } from 'lucide-react';
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

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  }), [tasks, searchQuery, filterPriority, filterCategory, filterStatus]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  }), [tasks]);

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'Hard': return 'bg-rose-50 text-rose-700 ring-rose-100';
      case 'High': return 'bg-amber-50 text-amber-700 ring-amber-100';
      default: return 'bg-blue-50 text-blue-700 ring-blue-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] font-sans">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <UserHeader title="My Tasks" />

        <section className="mb-6 rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Task Queue</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">Plan, filter, and update work.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
                Keep this list tight: search quickly, filter by priority or category, and update status as work moves.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QueueMetric label="Total" value={taskStats.total} icon={ListFilter} />
            <QueueMetric label="Pending" value={taskStats.pending} icon={Clock3} />
            <QueueMetric label="In Progress" value={taskStats.inProgress} icon={CalendarDays} />
            <QueueMetric label="Completed" value={taskStats.completed} icon={CheckCircle2} />
          </div>
        </section>

        <section className="mb-6 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
            <div className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search tasks..."
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

            <label className="relative">
              <span className="sr-only">Priority</span>
              <select
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-black text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white lg:w-44"
                onChange={(e) => setFilterPriority(e.target.value)}
                value={filterPriority}
              >
                <option value="All">All Priority</option>
                <option value="Hard">Hard</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </label>

            <label className="relative">
              <span className="sr-only">Category</span>
              <select
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-black text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white lg:w-48"
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </label>

            <label className="relative">
              <span className="sr-only">Status</span>
              <select
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-black text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white lg:w-44"
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
        </section>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
              <p className="text-lg font-black text-gray-900">No tasks found</p>
              <p className="mt-2 text-sm font-semibold text-gray-400">Adjust filters or create a new task.</p>
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
    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-500">
              {task.status === 'in-progress' ? 'In Progress' : task.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ring-1 ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <h4 className="truncate font-black text-gray-950">{task.title}</h4>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-gray-400">{task.description || 'No description added'}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 lg:min-w-36">
          <CalendarDays size={16} className="text-gray-400" />
            {task.due_date || 'No date'}
        </div>
        <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-500 lg:min-w-40">
          #{task.category || 'Uncategorized'}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="rounded-xl border border-gray-100 p-2 text-gray-400 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600" title="Edit Task">
            <Edit size={20} />
          </button>
          <button onClick={onDelete} className="rounded-xl border border-gray-100 p-2 text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600" title="Delete Task">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QueueMetric({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm">
        <Icon size={18} />
      </div>
      <p className="text-2xl font-black text-gray-950">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">{label}</p>
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
