"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeder';
import { 
  Search, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { getAllTasks, getAllUsers, createTaskAsAdmin, updateTaskAsAdmin, deleteTaskAsAdmin } from '@/app/lib/admin-actions';

// Define types based on your Supabase tables
interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'Low' | 'Medium' | 'High' | 'Hard';
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile; // joined from tasks_created_by_fkey
}

export default function AdminAllTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.profiles && t.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    Promise.all([getAllTasks(), getAllUsers()])
      .then(([tasksData, usersData]) => {
        setTasks(tasksData);
        setUsers(usersData);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTaskAsAdmin(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      if (err instanceof Error) alert(err.message);
      else alert('Failed to delete task');
    }
  };

  // Calculate metrics
  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => 
    t.status !== 'completed' && 
    t.due_date && new Date(t.due_date) < new Date()
  ).length;


  // Priority color helper
  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
      case 'Hard': return 'bg-rose-500';
      case 'High': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  // Handle image error by hiding the element
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <AdminHeader title="All Tasks" />

        {/* Global Overview Metrics (dynamic) */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <MetricCard label="Total Tasks" value={totalTasks} trend="All" color="bg-blue-500" />
          <MetricCard label="In Progress" value={inProgress} trend="Active" color="bg-indigo-600" />
          <MetricCard label="Completed" value={completed} trend={`${Math.round(completed/totalTasks*100) || 0}%`} color="bg-emerald-500" />
          <MetricCard label="Overdue" value={overdue} trend="Critical" color="bg-rose-500" />
        </div>

        {/* Action & Create Task Bar */}
        <div className="bg-[#1A1D21] p-6 rounded-[2rem] text-white flex justify-between items-center mb-10 shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-xl font-bold">Create Task</h2>
              <p className="text-xs text-gray-400 mt-1">Initialize a new system-wide project task</p>
           </div>
           <button 
             onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
             className="bg-white text-black p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg relative z-10"
           >
              <Plus size={24} strokeWidth={3} />
           </button>
           <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {/* Task Grid - Bento Box Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-400">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">No tasks found.</div>
          ) : (
            filteredTasks.map((task) => (
              <ProjectTaskCard
                key={task.id}
                task={task}
                onEdit={() => { setEditingTask(task); setIsModalOpen(true); }}
                onDelete={() => handleDelete(task.id)}
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
          users={users}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (formData: FormData) => {
            try {
              if (editingTask) {
                await updateTaskAsAdmin(editingTask.id, formData);
              } else {
                await createTaskAsAdmin(formData);
              }
              const updated = await getAllTasks();
              setTasks(updated);
              setIsModalOpen(false);
            } catch (err) {
              if (err instanceof Error) alert(err.message);
              else alert('An error occurred');
            }
          }}
        />
      )}
    </div>
  );
}

// Reusable MetricCard (unchanged except types)
function MetricCard({ label, value, trend, color }: { label: string; value: number; trend: string; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${color} text-white`}>
          <TrendingUp size={16} />
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{trend}</span>
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

// ProjectTaskCard with proper props
function ProjectTaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  getPriorityColor 
}: { 
  task: Task; 
  onEdit: () => void; 
  onDelete: () => void; 
  getPriorityColor: (priority: Task['priority']) => string;
}) {
  const assigneeName = task.profiles?.full_name || task.profiles?.email || 'Unassigned';
  const progress = task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 25;
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white flex flex-col hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className={`${priorityColor} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>
          {task.priority}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-gray-300 hover:text-blue-600">
            <Edit size={20} />
          </button>
          <button onClick={onDelete} className="text-gray-300 hover:text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Assigned Project</p>
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{task.title}</h3>
        <div className="flex items-center gap-2 mt-3">
           <div className="w-6 h-6 rounded-full bg-yellow-400 border border-white shadow-sm" />
           <p className="text-xs font-bold text-gray-500">Assignee: <span className="text-gray-900">{assigneeName}</span></p>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
            <span>Progress</span>
            <span className="text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${priorityColor} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase">Start Date</p>
            <p className="text-[11px] font-bold text-gray-900">{task.created_at ? new Date(task.created_at).toLocaleDateString() : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-400 uppercase">Due Date</p>
            <p className="text-[11px] font-bold text-gray-900">{task.due_date || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// TaskModal with typed props
function TaskModal({ 
  task, 
  users, 
  onClose, 
  onSubmit 
}: { 
  task: Task | null; 
  users: Profile[]; 
  onClose: () => void; 
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            defaultValue={task?.title}
            placeholder="Task title"
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
          />
          <textarea
            name="description"
            defaultValue={task?.description || ''}
            placeholder="Description"
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
          />
          <select
            name="priority"
            defaultValue={task?.priority || 'Medium'}
            className="w-full p-3 border border-gray-200 rounded-xl"
          >
            <option>Medium</option>
            <option>High</option>
            <option>Hard</option>
          </select>
          <select
            name="status"
            defaultValue={task?.status || 'pending'}
            className="w-full p-3 border border-gray-200 rounded-xl"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            name="due_date"
            defaultValue={task?.due_date || ''}
            className="w-full p-3 border border-gray-200 rounded-xl"
          />
          <select
            name="assigned_to"
            defaultValue={task?.assigned_to || ''}
            required
            className="w-full p-3 border border-gray-200 rounded-xl"
          >
            <option value="">Select assignee</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}