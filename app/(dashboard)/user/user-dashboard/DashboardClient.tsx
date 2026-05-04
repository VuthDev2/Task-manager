"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { ArrowRight, CalendarDays, CheckCircle2, Clock, ListTodo, PlusCircle, TimerReset, TrendingUp } from 'lucide-react';
import UserHeader from '@/app/components/UserHeader';
import useSWR from 'swr';
import { SWR_KEYS } from '@/app/lib/swr-keys';
import { fetchers } from '@/app/lib/swr-fetchers';

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

export default function DashboardClient({ initialTasks }: { initialTasks: Task[] }) {
  // Use SWR to keep tasks fresh across the app, with fallback to initial data
  const { data: tasks = [] } = useSWR(
    SWR_KEYS.tasks,
    fetchers.tasks,
    { fallbackData: initialTasks, revalidateOnMount: false }
  );

  const dashboard = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date()).length;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach(task => {
      const taskDate = task.due_date ? new Date(task.due_date) : new Date(task.created_at);
      if (taskDate >= startOfWeek) {
        const dayIndex = taskDate.getDay(); // 0 Sun ... 6 Sat
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Mon=0 ... Sun=6
        counts[adjustedIndex]++;
      }
    });

    const maxCount = Math.max(...counts, 1);
    const weeklyData = days.map((day, i) => ({
      day,
      count: counts[i],
      height: `${(counts[i] / maxCount) * 100}%`,
    }));

    const categoryMap: Record<string, number> = {};
    tasks.forEach(task => {
      const cat = task.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const sorted = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count, percent: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);

    const dueSoon = tasks
      .filter(t => t.status !== 'completed' && t.due_date)
      .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())
      .slice(0, 4);

    return {
      stats: { total, inProgress, pending, completed, overdue },
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      weeklyData,
      categoryPercentages: sorted,
      dueSoon,
    };
  }, [tasks]);

  const recentTasks = tasks.slice(0, 5);
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex min-h-screen bg-[#F6F7FB] font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <UserHeader title="Dashboard" />

        <section className="mb-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Workspace Overview</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">Your work, organized by priority.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                  Track what needs attention, what is moving, and what has already shipped without digging through every task.
                </p>
              </div>
              <Link href="/user/user-tasks" className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700">
                Manage tasks <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-100 bg-gray-950 p-6 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Completion Rate</p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-5xl font-black tracking-tight">{dashboard.completionRate}%</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">{dashboard.stats.completed} done</span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${dashboard.completionRate}%` }} />
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Tasks" value={dashboard.stats.total} icon={ListTodo} tone="text-blue-600 bg-blue-50" />
          <StatCard label="In Progress" value={dashboard.stats.inProgress} icon={TrendingUp} tone="text-indigo-600 bg-indigo-50" />
          <StatCard label="Pending" value={dashboard.stats.pending} icon={Clock} tone="text-amber-600 bg-amber-50" />
          <StatCard label="Completed" value={dashboard.stats.completed} icon={CheckCircle2} tone="text-emerald-600 bg-emerald-50" />
          <StatCard label="Overdue" value={dashboard.stats.overdue} icon={TimerReset} tone="text-rose-600 bg-rose-50" />
        </section>

        {tasks.length === 0 ? (
          // ---------- Empty State ----------
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-white px-4 py-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
              <PlusCircle size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Welcome to Infinite!</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              You do not have any tasks yet. Create your first task to start building a useful dashboard.
            </p>
            <Link
              href="/user/user-tasks"
              className="inline-flex items-center gap-2 bg-gray-950 text-white px-8 py-4 rounded-full font-black hover:bg-indigo-700 transition-all shadow-lg"
            >
              <PlusCircle size={20} />
              Create your first task
            </Link>
          </div>
        ) : (
          // ---------- Dashboard with data ----------
          <>
            <section className="mb-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-black text-gray-950">Weekly workload</h3>
                    <p className="mt-1 text-sm text-gray-500">Tasks created or due across this week.</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">
                    {tasks.length} tasks tracked
                  </span>
                </div>
                <div className="flex h-56 items-end justify-between gap-3 sm:gap-5">
                  {dashboard.weeklyData.map((item) => (
                    <WeeklyBar
                      key={item.day}
                      height={item.height}
                      day={item.day}
                      count={item.count}
                      active={item.day === todayName}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-black text-gray-950">Top categories</h3>
                <p className="mt-1 text-sm text-gray-500">Where your active workload sits.</p>
                <div className="mt-8 space-y-5">
                  {dashboard.categoryPercentages.length > 0 ? (
                    dashboard.categoryPercentages.map((cat) => (
                      <RatioLine
                        key={cat.name}
                        label={cat.name}
                        percent={cat.percent}
                        count={cat.count}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-400 text-sm">No tasks yet</p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-gray-950">Recent tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">A quick view of work that changed recently.</p>
                  </div>
                  <Link href="/user/user-tasks" className="text-xs font-black text-indigo-600 hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <ProjectRow
                      key={task.id}
                      name={task.title}
                      progress={task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 25}
                      status={task.status === 'completed' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      date={task.due_date || 'No date'}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="font-black text-gray-950">Due soon</h3>
                <p className="mt-1 text-sm text-gray-500">Keep deadlines visible before they become urgent.</p>
                <div className="mt-6 space-y-3">
                  {dashboard.dueSoon.length > 0 ? (
                    dashboard.dueSoon.map((task) => (
                      <DueSoonItem key={task.id} task={task} />
                    ))
                  ) : (
                    <p className="rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-400">No upcoming deadlines.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ElementType; tone: string }) {
  return (
    <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={21} />
      </div>
      <span className="block text-3xl font-black tracking-tight text-gray-950">{value}</span>
      <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{label}</span>
    </div>
  );
}

function WeeklyBar({ height, day, active, count }: { height: string; day: string; active: boolean; count: number }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-3 group">
      <span className="text-[10px] font-black text-gray-400">{count}</span>
      <div
        className={`min-h-2 w-full rounded-t-xl transition-all duration-700 ${
          active ? 'bg-gray-950 shadow-lg shadow-gray-200' : 'bg-gray-100 group-hover:bg-indigo-100'
        }`}
        style={{ height }}
      />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{day}</span>
    </div>
  );
}

function RatioLine({ label, percent, count }: { label: string; percent: number; count: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm font-bold">
        <span className="text-gray-900">{label}</span>
        <span className="text-gray-400">{count} tasks</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ProjectRow({ name, progress, status, date }: { name: string; progress: number; status: string; date: string }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-transparent p-4 transition-colors hover:border-gray-100 hover:bg-gray-50 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <CheckCircle2 size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-900">{name}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 sm:w-32">
          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="w-20 text-right text-[10px] font-black uppercase text-gray-400">{status}</span>
      </div>
    </div>
  );
}

function DueSoonItem({ task }: { task: Task }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-900">{task.title}</p>
          <p className="mt-1 text-xs font-semibold text-gray-400">{task.category || 'Uncategorized'}</p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-500">{task.status}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-500">
        <CalendarDays size={14} />
        {task.due_date || 'No date'}
      </div>
    </div>
  );
}
