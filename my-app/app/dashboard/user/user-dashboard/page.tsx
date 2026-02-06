"use client";
import React from 'react';
import Sidebar from '../../../components/Sidebar'; // Use the shared component
import { Search, Bell, TrendingUp, PieChart } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      {/* 1. Standardized Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* HEADER - Consistent with other tabs */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Project..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={22} className="text-gray-600" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-bold">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Project Manager</p>
              </div>
              <img src="/avatar.png" className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>

        {/* STATS CARDS - Refined with shadows and spacing */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Task" value="20" color="bg-blue-400" />
          <StatCard label="InProgress" value="24" color="bg-indigo-500" />
          <StatCard label="Pending" value="12" color="bg-rose-300" />
          <StatCard label="Completed" value="50" color="bg-orange-400" />
          <StatCard label="Overdue" value="02" color="bg-purple-300" />
        </div>

        {/* CHARTS SECTION - Professional Card Styling */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="font-bold text-gray-900">Total Work Activity</h3>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm font-medium italic">Chart Integration Ready</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={18} className="text-indigo-500" />
              <h3 className="font-bold text-gray-900">Task Ratio</h3>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
               <p className="text-gray-400 text-sm font-medium italic">Ratio Data Ready</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className={`${color} p-5 rounded-[2rem] text-white flex flex-col items-center justify-center shadow-lg shadow-gray-200/50 transform hover:-translate-y-1 transition-all cursor-default`}>
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
    </div>
  );
}