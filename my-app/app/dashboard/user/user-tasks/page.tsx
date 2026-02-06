"use client";
import React from 'react';
import Sidebar from'../../../components/Sidebar';
import { Search, Plus, ChevronDown, MoreVertical } from 'lucide-react';

export default function MyTasks() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Top Header - Kept identical to your dashboard for consistency */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Project..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
              />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <p className="text-sm font-bold">Username</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Project Manager</p>
              </div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Action & Filter Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-800">Tasks list</h2>
              <p className="text-sm text-gray-500">You have 3 tasks for today</p>
            </div>
            
            {/* Professional CTA Button */}
            <button className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              <span className="font-bold">Create Task</span>
              <div className="bg-white/20 p-1 rounded-lg">
                <Plus size={20} />
              </div>
            </button>
          </div>

          {/* Styled Filter Bar */}
          <div className="bg-[#D1E9ED]/50 backdrop-blur-sm p-2 rounded-2xl flex items-center gap-3 border border-[#B8DDE3]">
            <div className="flex-1 relative ml-2">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Quick search tasks..." 
                className="w-full bg-transparent pl-6 pr-4 py-2 outline-none text-sm text-gray-700 placeholder:text-gray-500" 
              />
            </div>
            <FilterPill label="Status" />
            <FilterPill label="Priority" />
            <FilterPill label="Category" />
          </div>
        </div>

        {/* Task Table Structure */}
        <div className="grid grid-cols-12 px-6 mb-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
          <div className="col-span-5">Task Details</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-1"></div>
        </div>

        {/* Task Items */}
        <div className="space-y-3">
          <TaskItem 
            title="Graphic Design" 
            sub="Prepare the branding file" 
            date="10 Feb" 
            priority="Medium" 
            category="Project" 
            color="bg-blue-500"
          />
          <TaskItem 
            title="Coffee Website" 
            sub="Client: Angkor Cafe" 
            date="25 Feb" 
            priority="High" 
            category="Work" 
            color="bg-orange-500"
          />
          <TaskItem 
            title="Mobile App" 
            sub="Car selling App UX" 
            date="05 Mar" 
            priority="Hard" 
            category="Personal" 
            color="bg-purple-500"
          />
        </div>
      </main>
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="bg-white/80 px-4 py-1.5 rounded-xl flex items-center gap-2 text-[13px] font-bold text-gray-700 hover:bg-white transition-all shadow-sm border border-gray-100">
      {label} <ChevronDown size={14} className="text-gray-400" />
    </button>
  );
}

function TaskItem({ title, sub, date, priority, category, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group border border-transparent hover:border-gray-100">
      {/* Signature Vertical Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black" />
      
      <div className="grid grid-cols-12 w-full items-center">
        <div className="col-span-5 pl-6">
          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-medium">{sub}</p>
        </div>
        
        <div className="col-span-2 text-center">
          <span className="text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">{date}</span>
        </div>
        
        <div className="col-span-2 flex justify-center">
          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full text-white ${color}`}>
            {priority}
          </span>
        </div>
        
        <div className="col-span-2 text-center text-sm font-bold text-gray-500 italic">
          #{category}
        </div>
        
        <div className="col-span-1 flex justify-end pr-4 text-gray-300 hover:text-gray-600 cursor-pointer">
          <MoreVertical size={20} />
        </div>
      </div>
    </div>
  );
}