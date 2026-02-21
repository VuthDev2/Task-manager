"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Search, Bell, TrendingUp, PieChart, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';
import { getUserTasks } from '@/app/lib/task-actions';
import UserHeader from '@/app/components/UserHeader';

// Define Task interface
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  category: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Helper to format relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function UserDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, pending: 0, completed: 0, overdue: 0 });
  const [weeklyData, setWeeklyData] = useState<{ day: string; height: string }[]>([]);
  const [categoryPercentages, setCategoryPercentages] = useState<{ name: string; percent: number; color: string }[]>([]);

  useEffect(() => {
    getUserTasks().then((data: Task[]) => {
      setTasks(data);

      // --- Stats calculation ---
      const total = data.length;
      const inProgress = data.filter(t => t.status === 'in-progress').length;
      const pending = data.filter(t => t.status === 'pending').length;
      const completed = data.filter(t => t.status === 'completed').length;
      const overdue = data.filter(t => t.status !== 'completed' && new Date(t.due_date || '') < new Date()).length;
      setStats({ total, inProgress, pending, completed, overdue });

      // --- Weekly graph data (Mon–Sun) ---
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const counts = [0, 0, 0, 0, 0, 0, 0];

      data.forEach(task => {
        const taskDate = task.due_date ? new Date(task.due_date) : new Date(task.created_at);
        if (taskDate >= startOfWeek) {
          const dayIndex = taskDate.getDay(); // 0 Sun ... 6 Sat
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Mon=0 ... Sun=6
          counts[adjustedIndex]++;
        }
      });

      const maxCount = Math.max(...counts, 1);
      setWeeklyData(days.map((day, i) => ({
        day,
        height: `${(counts[i] / maxCount) * 100}%`,
      })));

      // --- Category percentages for task ratio ---
      const categoryMap: Record<string, number> = {};
      data.forEach(task => {
        const cat = task.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      // Sort categories by count (descending) and take top 3 for display
      const sorted = Object.entries(categoryMap)
        .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 3);

      // Define a color palette
      const colors = ['bg-indigo-600', 'bg-blue-500', 'bg-rose-400'];
      setCategoryPercentages(sorted.map((item, idx) => ({ ...item, color: colors[idx] || 'bg-gray-500' })));
    }).catch(err => {
      console.error('Failed to load tasks:', err);
    });
  }, []);

  // Get the 3 most recent tasks for "Active Projects"
  const recentTasks = tasks.slice(0, 3);

  // Activity feed items (dynamic if tasks exist, otherwise fallback)
  const activities = tasks.length > 0
    ? [
        { user: 'You', action: 'created', target: tasks[0].title, time: timeAgo(tasks[0].created_at) },
        { user: 'System', action: 'updated', target: 'dashboard', time: '5m ago' },
      ]
    : [
        { user: 'System', action: 'No tasks yet', target: 'create one!', time: 'now' },
      ];

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex min-h-screen bg-[#F3F4F9] font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <UserHeader title="Dashboard" />

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Task" value={stats.total} color="bg-blue-500" />
          <StatCard label="InProgress" value={stats.inProgress} color="bg-indigo-600" />
          <StatCard label="Pending" value={stats.pending} color="bg-rose-400" />
          <StatCard label="Completed" value={stats.completed} color="bg-orange-500" />
          <StatCard label="Overdue" value={stats.overdue} color="bg-purple-500" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Work Activity (Dynamic Graph) */}
          <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-blue-500">
                <TrendingUp size={18} strokeWidth={3} />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Total Work Activity</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {tasks.length} tasks this week
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
              {weeklyData.map((item) => (
                <WeeklyBar
                  key={item.day}
                  height={item.height}
                  day={item.day}
                  active={item.day === todayName}
                />
              ))}
            </div>
          </div>

          {/* Task Ratio – Now dynamic! */}
          <div className="col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-80 flex flex-col">
            <div className="flex items-center gap-2 mb-8 text-indigo-500">
              <PieChart size={18} strokeWidth={3} />
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Task Ratio</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              {categoryPercentages.length > 0 ? (
                categoryPercentages.map((cat) => (
                  <RatioLine
                    key={cat.name}
                    label={cat.name}
                    percent={cat.percent}
                    color={cat.color}
                  />
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm">No tasks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Projects & Activity */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Projects Table */}
          <div className="col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-900">Active Projects</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <ProjectRow
                    key={task.id}
                    name={task.title}
                    progress={task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 25}
                    status={task.status === 'completed' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    date={task.due_date || 'No date'}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm">No recent tasks</p>
              )}
            </div>
          </div>

          {/* Team Activity Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
            <h3 className="font-black text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {activities.map((act, idx) => (
                <ActivityItem
                  key={idx}
                  user={act.user}
                  action={act.action}
                  target={act.target}
                  time={act.time}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Components (unchanged) ---

function StatCard({ label, value, color }: any) {
  return (
    <div className={`${color} p-6 rounded-[2.2rem] text-white flex flex-col items-center justify-center shadow-xl`}>
      <span className="text-3xl font-black tracking-tight">{value}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80 mt-1">{label}</span>
    </div>
  );
}

function WeeklyBar({ height, day, active }: any) {
  return (
    <div className="flex-1 flex flex-col items-center gap-3 group">
      <div
        className={`w-full rounded-t-xl transition-all duration-700 ${
          active ? 'bg-black shadow-lg shadow-gray-200' : 'bg-gray-100 group-hover:bg-blue-100'
        }`}
        style={{ height }}
      />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{day}</span>
    </div>
  );
}

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
          <span className="font-black text-indigo-600">{user}</span> {action}{' '}
          <span className="font-black">{target}</span>
        </p>
        <div className="flex items-center gap-1 mt-1 text-gray-400">
          <Clock size={10} />
          <p className="text-[9px] font-bold uppercase">{time}</p>
        </div>
      </div>
    </div>
  );
}