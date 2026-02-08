"use client";
import React from 'react';
import Sidebar from '../../../components/Sidebar';
import { Search, Bell, TrendingUp, PieChart, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9] font-sans">
      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* --- SECTION: HEADER --- */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Project..." 
                className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            {/* Notification */}
            <div className="relative cursor-pointer hover:scale-110 transition-transform p-2 bg-white rounded-full shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Project Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm overflow-hidden">
                <img src="/avatar.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* --- SECTION: TOP STATS --- */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Task" value="20" color="bg-blue-500" />
          <StatCard label="InProgress" value="24" color="bg-indigo-600" />
          <StatCard label="Pending" value="12" color="bg-rose-400" />
          <StatCard label="Completed" value="50" color="bg-orange-500" />
          <StatCard label="Overdue" value="02" color="bg-purple-500" />
        </div>

        {/* --- SECTION: CHARTS --- */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          
          {/* Total Work Activity - Visual Weekly Bar Chart */}
          <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-blue-500">
                <TrendingUp size={18} strokeWidth={3} />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Total Work Activity</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Productivity +12%</span>
              </div>
            </div>
            
            {/* The Graph Visualizer */}
            <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
              <WeeklyBar height="45%" day="Mon" />
              <WeeklyBar height="70%" day="Tue" />
              <WeeklyBar height="55%" day="Wed" />
              <WeeklyBar height="95%" day="Thu" active /> {/* Thursday Highlighted */}
              <WeeklyBar height="60%" day="Fri" />
              <WeeklyBar height="40%" day="Sat" />
              <WeeklyBar height="30%" day="Sun" />
            </div>
          </div>

          {/* Task Ratio - Linear Breakdown */}
          <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex items-center gap-2 mb-8 text-indigo-500">
              <PieChart size={18} strokeWidth={3} />
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Task Ratio</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
              <RatioLine label="Development" percent={65} color="bg-indigo-600" />
              <RatioLine label="UI/UX Design" percent={25} color="bg-blue-500" />
              <RatioLine label="Marketing" percent={10} color="bg-rose-400" />
            </div>
          </div>

        </div>

        {/* --- SECTION: RECENT PROJECTS & ACTIVITY --- */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Recent Projects Table */}
          <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-900">Active Projects</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              <ProjectRow name="Infinite Corporate Redesign" progress={75} status="On Track" date="20 Oct" />
              <ProjectRow name="Mobile App API Integration" progress={40} status="In Review" date="24 Oct" />
              <ProjectRow name="Backend Database Security" progress={90} status="Critical" date="18 Oct" />
            </div>
          </div>

          {/* Team Activity Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
            <h3 className="font-black text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              <ActivityItem user="Srey Pich" action="completed" target="UI Design" time="2m ago" />
              <ActivityItem user="Vannak" action="commented" target="Bug Fix #12" time="15m ago" />
              <ActivityItem user="Dara" action="added" target="New Asset" time="1h ago" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

function StatCard({ label, value, color }: any) {
  return (
    <div className={`${color} p-6 rounded-[2.2rem] text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-100/20 transform hover:-translate-y-1 transition-all cursor-default`}>
      <span className="text-3xl font-black tracking-tight">{value}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80 mt-1">{label}</span>
    </div>
  );
}

function ProjectRow({ name, progress, status, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-gray-900">{name}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] font-black uppercase text-gray-400 w-16 text-right">{status}</span>
        <MoreHorizontal size={18} className="text-gray-300 cursor-pointer hover:text-gray-900" />
      </div>
    </div>
  );
}

function ActivityItem({ user, action, target, time }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
      <div>
        <p className="text-xs font-bold text-gray-800">
          <span className="font-black text-indigo-600">{user}</span> {action} <span className="font-black">{target}</span>
        </p>
        <div className="flex items-center gap-1 mt-1 text-gray-400">
          <Clock size={10} />
          <p className="text-[9px] font-bold uppercase">{time}</p>
        </div>
      </div>
    </div>
  );
}

// Visual Weekly Bar component
function WeeklyBar({ height, day, active }: any) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3 group">
      <div 
        className={`w-full rounded-t-xl transition-all duration-700 ${active ? 'bg-black shadow-lg shadow-gray-200' : 'bg-gray-100 group-hover:bg-blue-100'}`} 
        style={{ height: height }}
      />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{day}</span>
    </div>
  );
}

// Visual Ratio Progress component
function RatioLine({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tighter">
        <span className="text-gray-900">{label}</span>
        <span className="text-gray-400">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}