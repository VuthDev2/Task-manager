"use client";
import React from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  X, 
  MoreHorizontal 
} from 'lucide-react';

export default function Notifications() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Unified Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="bg-black p-2 rounded-lg text-white">
                <Bell size={20} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search alerts..." 
                className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none" 
              />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <p className=" font-bold text-gray-950">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Project Manager</p>
              </div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Filters & Actions */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex gap-4">
            <button className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">All</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1">Unread</button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1">Archive</button>
          </div>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
            Mark all as read
          </button>
        </div>

        {/* Notifications Feed */}
        <div className="max-w-4xl space-y-4">
          <NotificationItem 
            type="new"
            sender="INFINITE"
            time="10 mins ago"
            message="Good morning, Saravuth. Could you please send me the CSV file for the transaction?"
            statusColor="bg-blue-500"
          />
          <NotificationItem 
            type="task"
            sender="New Task Assigned"
            time="25 mins ago"
            message="You have been assigned to 'UX/UI design for Ice cream shop'. Please review the project brief."
            statusColor="bg-green-500"
          />
          <NotificationItem 
            type="update"
            sender="Task Update"
            time="1 hour ago"
            message="Mobile App for Car selling app has been updated with 3 new features in the 'BYD 2026' model section."
            statusColor="bg-orange-500"
          />
          <NotificationItem 
            type="alert"
            sender="System Alert"
            time="2 hours ago"
            message="Task 'Create chess game using Python' has been deleted by the administrator."
            statusColor="bg-rose-500"
          />
        </div>
      </main>
    </div>
  );
}

function NotificationItem({ type, sender, time, message, statusColor }: any) {
  // Determine Icon based on type
  const getIcon = () => {
    switch(type) {
      case 'new': return <CheckCircle2 size={18} className="text-blue-500" />;
      case 'task': return <RefreshCcw size={18} className="text-green-500" />;
      case 'update': return <AlertCircle size={18} className="text-orange-500" />;
      case 'alert': return <X size={18} className="text-rose-500" />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 relative overflow-hidden group border border-transparent hover:border-gray-100">
      {/* Visual Status Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`} />
      
      <div className={`p-2 rounded-xl bg-gray-50`}>
        {getIcon()}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-gray-900 text-sm tracking-tight">{sender}</h4>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{time}</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {message}
        </p>
        
        <div className="flex items-center gap-6">
          <button className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Accept</button>
          <button className="text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest">Dismiss</button>
          <button className="text-xs font-black text-gray-900 hover:underline uppercase tracking-widest">Mark as read</button>
        </div>
      </div>

      <button className="text-gray-300 hover:text-gray-600 self-start">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}