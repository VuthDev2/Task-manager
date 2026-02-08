"use client";
import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  Filter,
  Users as UsersIcon,
  Activity,
  Globe
} from 'lucide-react';

export default function AdminAllUsers() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">System Access Control</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-80 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm flex items-center justify-center font-bold">S</div>
            </div>
          </div>
        </header>

        {/* TOP METRICS - Professional Bento Style */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <MetricCard label="Total Users" value="1,240" icon={UsersIcon} color="bg-blue-600" trend="+12" />
          <MetricCard label="Active Now" value="382" icon={Activity} color="bg-emerald-500" trend="Live" />
          <MetricCard label="Admins" value="12" icon={ShieldCheck} color="bg-indigo-600" trend="Secured" />
          <MetricCard label="Regional" value="05" icon={Globe} color="bg-orange-500" trend="Global" />
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-3xl border border-white shadow-sm">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
              <Filter size={14} /> Filter By Role
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
               All Status
            </button>
          </div>
          <button className="bg-black text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            <UserPlus size={16} />
            Add New Member
          </button>
        </div>

        {/* MODERN USERS TABLE */}
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
              <UserRow name="Kola" email="kola24@infinite.com" role="Marketing Manager" active="1 hour ago" status="bg-blue-500" />
              <UserRow name="Henry" email="henry24@infinite.com" role="App Developer" active="30 mins ago" status="bg-emerald-500" />
              <UserRow name="Shanwu" email="shanwu24@infinite.com" role="UI/UX Designer" active="Now" status="bg-emerald-500" />
              <UserRow name="Devid" email="devid24@infinite.com" role="FullStack Dev" active="Now" status="bg-emerald-500" />
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

function UserRow({ name, email, role, active, status }: any) {
  return (
    <tr className="hover:bg-gray-50/50 transition-all group">
      <td className="px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 relative">
            {name.charAt(0)}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${status}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{name}</p>
            <p className="text-xs text-gray-400 font-medium">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
          {role}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <p className="text-xs font-bold text-gray-900">{active}</p>
        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Last Activity</p>
      </td>
      <td className="px-8 py-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <button className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
            Manage
          </button>
          <button className="text-gray-300 hover:text-gray-900">
            <MoreVertical size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}