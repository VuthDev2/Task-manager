"use client";
import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  MoreVertical, 
  Users, 
  FolderLock, 
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function AdminCategories() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Categories</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Global Taxonomy Management</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
               <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Super Admin</p>
              </div>
              <img src="/avatar.png" className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>

        {/* TOP BENTO SECTION: Category Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1A1D21] p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Categories</h3>
              <p className="text-4xl font-black tracking-tighter">12</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers size={28} className="text-blue-400" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex justify-between items-center">
             <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Projects</h3>
               <p className="text-4xl font-black tracking-tighter text-gray-900">48</p>
             </div>
             <div className="bg-emerald-50 p-4 rounded-2xl">
               <Activity size={28} className="text-emerald-500" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-center items-center group cursor-pointer hover:bg-blue-600 transition-all">
             <Plus size={32} className="text-blue-600 group-hover:text-white transition-colors" />
             <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-gray-400 group-hover:text-white/80">Add New Category</p>
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryControlCard 
            name="Personal Task" 
            count={142} 
            users={12} 
            color="bg-blue-500" 
            description="Private individual task management and personal productivity logs."
          />
          <CategoryControlCard 
            name="Project Management" 
            count={86} 
            users={24} 
            color="bg-indigo-600" 
            description="Large scale factory scanning systems and corporate infrastructure."
          />
          <CategoryControlCard 
            name="Work & Finance" 
            count={34} 
            users={8} 
            color="bg-orange-500" 
            description="Transaction summaries, monthly expense reports, and client billing."
          />
        </div>
      </main>
    </div>
  );
}

function CategoryControlCard({ name, count, users, color, description }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white flex flex-col hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>
          <FolderLock size={20} />
        </div>
        <button className="text-gray-300 hover:text-gray-900 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{name}</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks</span>
          <span className="text-sm font-bold text-gray-900">{count} Active</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Team</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users size={12} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-900">{users} Members</span>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-3 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
        Manage Category
      </button>
    </div>
  );
}