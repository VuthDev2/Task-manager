"use client";
import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function AdminAllTasks() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System-Wide Tasks</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Admin Control Center</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search all project tasks..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Web Developer</p>
              </div>
              <img src="/avatar.png" className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Global Overview Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <MetricCard label="Total Tasks" value="156" trend="+12%" color="bg-blue-500" />
          <MetricCard label="In Progress" value="42" trend="Active" color="bg-indigo-600" />
          <MetricCard label="Completed" value="110" trend="88%" color="bg-emerald-500" />
          <MetricCard label="Overdue" value="04" trend="Critical" color="bg-rose-500" />
        </div>

        {/* Action & Create Task Bar */}
        <div className="bg-[#1A1D21] p-6 rounded-[2rem] text-white flex justify-between items-center mb-10 shadow-xl relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-xl font-bold">Create Task</h2>
              <p className="text-xs text-gray-400 mt-1">Initialize a new system-wide project task</p>
           </div>
           <button className="bg-white text-black p-3 rounded-2xl hover:scale-110 transition-transform shadow-lg relative z-10">
              <Plus size={24} strokeWidth={3} />
           </button>
           {/* Decorative UI element */}
           <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Task Grid - Bento Box Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectTaskCard 
            title="Task Manager Project" 
            assignee="Saravuth" 
            progress={90} 
            startDate="10 Jan" 
            endDate="29 Jan" 
            priority="Hard"
            priorityColor="bg-rose-500"
          />
          <ProjectTaskCard 
            title="App UI UX Design" 
            assignee="Sokun" 
            progress={30} 
            startDate="12 Jan" 
            endDate="25 Jan" 
            priority="Medium"
            priorityColor="bg-blue-500"
          />
          <ProjectTaskCard 
            title="Database Migration" 
            assignee="Dara" 
            progress={65} 
            startDate="15 Jan" 
            endDate="02 Feb" 
            priority="Low"
            priorityColor="bg-emerald-500"
          />
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, trend, color }: any) {
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

function ProjectTaskCard({ title, assignee, progress, startDate, endDate, priority, priorityColor }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white flex flex-col hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className={`${priorityColor} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm`}>
          {priority}
        </div>
        <button className="text-gray-300 hover:text-gray-900">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Assigned Project</p>
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{title}</h3>
        <div className="flex items-center gap-2 mt-3">
           <div className="w-6 h-6 rounded-full bg-yellow-400 border border-white shadow-sm" />
           <p className="text-xs font-bold text-gray-500">Assignee: <span className="text-gray-900">{assignee}</span></p>
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
            <p className="text-[11px] font-bold text-gray-900">{startDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-400 uppercase">End Date</p>
            <p className="text-[11px] font-bold text-gray-900">{endDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}