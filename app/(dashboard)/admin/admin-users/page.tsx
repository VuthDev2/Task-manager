"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeder';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Filter,
  Users as UsersIcon,
  Activity,
  Globe,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { getAllUsers, updateUserRole, deleteUser } from '@/app/lib/admin-actions';

// Define the user type based on your profiles table
interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  updated_at: string;
  last_sign_in_at?: string | null; // optional, may not be in profiles
}

export default function AdminAllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, role);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      setEditingUserId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Calculate metrics
  const totalUsers = users.length;
  const activeToday = users.filter(u => {
    if (!u.last_sign_in_at) return false;
    const last = new Date(u.last_sign_in_at);
    const today = new Date();
    return last.toDateString() === today.toDateString();
  }).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Helper to format last active
  const formatLastActive = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <AdminHeader title="User Management" />

        <section className="mb-6 rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Admin Directory</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">Manage people and access.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
                Review roles, identify active users, and keep permissions intentional.
              </p>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
              onClick={() => alert('Add new member – implement with Supabase Admin API or sign-up link.')}
            >
              <UserPlus size={17} />
              Add Member
            </button>
          </div>
        </section>

        {/* TOP METRICS - dynamic */}
        <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Users" value={totalUsers} icon={UsersIcon} color="bg-blue-600" trend="Total" />
          <MetricCard label="Active Today" value={activeToday} icon={Activity} color="bg-emerald-500" trend="Live" />
          <MetricCard label="Admins" value={adminCount} icon={ShieldCheck} color="bg-indigo-600" trend="Secured" />
          <MetricCard label="Regional" value="—" icon={Globe} color="bg-orange-500" trend="Global" />
        </div>

        {/* ACTION BAR */}
        <div className="mb-6 grid gap-3 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold text-gray-600 lg:w-auto">
              <Filter size={14} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
                className="w-full bg-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
        )}

        {/* USERS TABLE */}
        <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center text-gray-400">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="py-20 text-center text-gray-400">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isEditing={editingUserId === user.id}
                    onEditStart={() => { setEditingUserId(user.id); setNewRole(user.role); }}
                    onEditCancel={() => setEditingUserId(null)}
                    onRoleChange={() => handleRoleChange(user.id, newRole)}
                    onDelete={() => handleDelete(user.id)}
                    newRole={newRole}
                    setNewRole={setNewRole}
                    formatLastActive={formatLastActive}
                  />
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-sm`}>
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-3xl font-black text-gray-950 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function UserRow({ 
  user, 
  isEditing, 
  onEditStart, 
  onEditCancel, 
  onRoleChange, 
  onDelete, 
  newRole, 
  setNewRole,
  formatLastActive 
}: any) {
  const statusColor = user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500';

  return (
    <tr className="hover:bg-gray-50/70 transition-all group">
      <td className="px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 relative">
            {user.full_name?.[0] || user.email[0].toUpperCase()}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColor}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{user.full_name || 'No name'}</p>
            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
              className="text-xs font-bold border rounded-lg px-2 py-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={onRoleChange} className="text-green-600 hover:text-green-800">
              <Check size={16} />
            </button>
            <button onClick={onEditCancel} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        ) : (
          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {user.role === 'admin' ? 'Administrator' : 'User'}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        <p className="text-xs font-bold text-gray-900">{formatLastActive(user.last_sign_in_at)}</p>
        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Last Activity</p>
      </td>
      <td className="px-8 py-4 text-right">
        <div className="flex items-center justify-end gap-3">
          {!isEditing && (
            <>
              <button onClick={onEditStart} className="text-gray-400 hover:text-blue-600">
                <Edit size={18} />
              </button>
              <button onClick={onDelete} className="text-gray-400 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
