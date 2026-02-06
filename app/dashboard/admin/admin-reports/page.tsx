"use client";
import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { 
  Search, 
  FileText, 
  Download, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytical Reports</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">System Performance & Insights</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full w-64 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <button className="bg-black text-white p-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-md">
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* TOP SUMMARY CARDS (BENTO STYLE) */}
        <div className="grid grid-cols-5 gap-4 mb-10">
          <ReportMetric label="Total Task" value="20" color="bg-blue-500" icon={FileText} />
          <ReportMetric label="In Progress" value="24" color="bg-indigo-600" icon={Clock} />
          <ReportMetric label="Pending" value="12" color="bg-rose-400" icon={AlertCircle} />
          <ReportMetric label="Completed" value="50" color="bg-emerald-500" icon={CheckCircle2} />
          <ReportMetric label="Overdue" value="02" color="bg-black" icon={Target} />
        </div>

        {/* MAIN DATA SECTION */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Visual Progress Bento */}
          <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">This Week Performance</h3>
            
            {/* Professional Progress Ring */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="502.4" strokeDashoffset="150.7" className="text-blue-600 stroke-round transition-all duration-1000" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-4xl font-black text-gray-900">70%</span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Working</span>
               </div>
            </div>
            
            <p className="text-xs font-medium text-gray-500 px-4">System output is <span className="text-emerald-500 font-bold">+12% higher</span> than last week.</p>
          </div>

          {/* Project Summary Bento */}
          <div className="col-span-2 bg-[#1A1D21] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Project Status</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Client Delivery Overview</p>
                </div>
                <TrendingUp className="text-emerald-400" size={32} />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-gray-300 italic">
                  "We would like to announce that the projects of clients this week have been progressing at an optimal rate of 70%. Please maintain this momentum and continue to push for excellence. Great work, team!"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Top Performer</p>
                    <p className="text-sm font-bold">Mobile App Team</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg. Completion</p>
                    <p className="text-sm font-bold">4.2 Days</p>
                 </div>
              </div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all" />
          </div>

        </div>

        {/* BOTTOM SECTION: RECENT GENERATED REPORTS */}
        <div className="mt-8 bg-white p-6 rounded-[2rem] shadow-sm border border-white">
          <div className="flex justify-between items-center mb-6 px-4">
            <h3 className="font-bold text-gray-900">Recent Generated Reports</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ChevronRight size={14}/></button>
          </div>
          <div className="space-y-2">
            <ReportItem title="Monthly Financial Summary" date="Feb 01, 2026" size="2.4 MB" />
            <ReportItem title="User Activity Audit" date="Jan 28, 2026" size="1.8 MB" />
          </div>
        </div>
      </main>
    </div>
  );
}

function ReportMetric({ label, value, color, icon: Icon }: any) {
  return (
    <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-white flex flex-col items-center justify-center group hover:shadow-md transition-all">
      <div className={`${color} p-2 rounded-xl text-white mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={16} />
      </div>
      <p className="text-xl font-black text-gray-900 tracking-tighter">{value}</p>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ReportItem({ title, date, size }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-black text-gray-400">{size}</span>
        <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors">
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}