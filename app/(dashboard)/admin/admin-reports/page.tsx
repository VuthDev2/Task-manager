"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeder';
import { 
  Search, 
  FileText, 
  Download, 
  TrendingUp, 
  ChevronRight,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getAllTasks } from '@/app/lib/admin-actions';

// Define the Task interface (adjust to match your actual data)
interface Profile {
  email: string;
  full_name: string | null;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'Low' | 'Medium' | 'High' | 'Hard';
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile; // from the join
}

export default function AdminReports() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllTasks()
      .then((data) => {
        setTasks(data as Task[]); // temporary assertion
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate metrics
  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date()).length;

  const completionRate = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  const priorityCounts = {
    Low: tasks.filter(t => t.priority === 'Low').length,
    Medium: tasks.filter(t => t.priority === 'Medium').length,
    High: tasks.filter(t => t.priority === 'High').length,
    Hard: tasks.filter(t => t.priority === 'Hard').length,
  };

  // Tasks by user (from profiles)
  const userTaskCount: Record<string, number> = {};
  tasks.forEach(t => {
    const email = t.profiles?.email || 'Unknown';
    userTaskCount[email] = (userTaskCount[email] || 0) + 1;
  });
  const topUsers = Object.entries(userTaskCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <AdminHeader title="Reports" />

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-5 gap-4 mb-10">
          <ReportMetric label="Total Tasks" value={totalTasks} color="bg-blue-500" icon={FileText} />
          <ReportMetric label="In Progress" value={inProgress} color="bg-indigo-600" icon={Clock} />
          <ReportMetric label="Pending" value={pending} color="bg-rose-400" icon={AlertCircle} />
          <ReportMetric label="Completed" value={completed} color="bg-emerald-500" icon={CheckCircle2} />
          <ReportMetric label="Overdue" value={overdue} color="bg-black" icon={Target} />
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading reports...</div>
        ) : (
          <>
            {/* MAIN DATA SECTION */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Completion Rate Gauge */}
              <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Completion Rate</h3>
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray="502.4"
                      strokeDashoffset={502.4 - (502.4 * completionRate / 100)}
                      className="text-blue-600 stroke-round transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-gray-900">{completionRate}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Completed</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-500 px-4">
                  {completed} of {totalTasks} tasks done
                </p>
              </div>

              {/* Priority Breakdown */}
              <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">By Priority</h3>
                <div className="space-y-4">
                  <PriorityBar label="Hard" count={priorityCounts.Hard} total={totalTasks} color="bg-rose-500" />
                  <PriorityBar label="High" count={priorityCounts.High} total={totalTasks} color="bg-orange-500" />
                  <PriorityBar label="Medium" count={priorityCounts.Medium} total={totalTasks} color="bg-blue-500" />
                  <PriorityBar label="Low" count={priorityCounts.Low} total={totalTasks} color="bg-emerald-500" />
                </div>
              </div>

              {/* Top Users by Tasks */}
              <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Top Contributors</h3>
                <div className="space-y-4">
                  {topUsers.map(([email, count]) => (
                    <div key={email} className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{email}</span>
                      <span className="text-xs font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{count} tasks</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Recent Generated Reports (static for now) */}
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
          </>
        )}
      </main>
    </div>
  );
}

// Reusable components (unchanged)
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

function PriorityBar({ label, count, total, color }: any) {
  const percentage = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{count} ({percentage}%)</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
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