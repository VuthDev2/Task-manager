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
import { users } from '@/drizzle/schema';

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

        {/* TOP METRICS - dynamic */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <MetricCard label="Total Users" value={totalUsers} icon={UsersIcon} color="bg-blue-600" trend="Total" />
          <MetricCard label="Active Today" value={activeToday} icon={Activity} color="bg-emerald-500" trend="Live" />
          <MetricCard label="Admins" value={adminCount} icon={ShieldCheck} color="bg-indigo-600" trend="Secured" />
          <MetricCard label="Regional" value="—" icon={Globe} color="bg-orange-500" trend="Global" />
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-3xl border border-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600">
              <Filter size={14} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
                className="bg-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button 
            className="bg-black text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            onClick={() => alert('Add new member – implement with Supabase Admin API or sign-up link.')}
          >
            <UserPlus size={16} />
            Add New Member
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>
        )}

        {/* USERS TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
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
      </main>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}>
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
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
    <tr className="hover:bg-gray-50/50 transition-all group">
      <td className="px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 relative">
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

