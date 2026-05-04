"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  KanbanSquare,
  LineChart,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
} as const;

const workflow = [
  {
    icon: KanbanSquare,
    title: 'Plan the work',
    text: 'Create clean task flows, assign ownership, and keep priority visible from the first meeting.',
  },
  {
    icon: MessageSquareText,
    title: 'Align the team',
    text: 'Comments, updates, and status changes stay attached to the work everyone is discussing.',
  },
  {
    icon: LineChart,
    title: 'Improve delivery',
    text: 'Progress signals help teams spot slowdowns early and protect deadlines with less noise.',
  },
];

const proof = [
  { value: '42%', label: 'fewer missed handoffs' },
  { value: '3.8x', label: 'faster task review cycles' },
  { value: '24/7', label: 'workspace visibility' },
];

const timeline = [
  { time: '09:00', label: 'Sprint plan finalized', color: 'bg-indigo-500' },
  { time: '11:30', label: 'Design review completed', color: 'bg-emerald-500' },
  { time: '14:00', label: 'Backend task unblocked', color: 'bg-amber-500' },
  { time: '16:45', label: 'Daily summary sent', color: 'bg-rose-500' },
];

export default function LandingExpansion() {
  return (
    <>
      <section className="bg-[#F7F8FC] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div {...reveal}>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Workflow System</p>
            <h2 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-5xl">
              A longer runway from idea to done.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Infinite keeps planning, teamwork, and reporting in one calm workspace so projects feel easier to move across every device.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {workflow.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-gray-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{item.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            {...reveal}
            className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-950 p-4 shadow-2xl sm:p-6 lg:rounded-[2.5rem]"
          >
            <div className="rounded-[1.5rem] bg-white p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Today</p>
                  <h3 className="mt-1 text-xl font-black text-gray-950">Team command center</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                  <Sparkles size={14} />
                  Live Sync
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <span className={`h-3 w-3 shrink-0 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-xs font-black text-gray-400">{item.time}</p>
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#EEF2FF] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-black text-indigo-700">
                    <CalendarDays size={18} />
                    Release readiness
                  </div>
                  <span className="text-xs font-black text-indigo-700">78%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-indigo-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...reveal}>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">Professional Controls</p>
            <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-5xl">
              Designed to feel polished when work gets busy.
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                { icon: Bell, title: 'Smart notifications', text: 'Important updates surface quickly without turning every action into a distraction.' },
                { icon: Clock3, title: 'Deadline clarity', text: 'Timeline states make late, blocked, and completed work easy to scan.' },
                { icon: ShieldCheck, title: 'Reliable workspace', text: 'Responsive layouts keep the product usable from phone check-ins to desktop planning.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gray-950 px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-indigo-300">Measured Momentum</p>
              <h2 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                Give every team a clearer path through the week.
              </h2>
            </div>
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-black text-gray-950 transition hover:bg-indigo-100 sm:w-auto"
            >
              Start now <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {proof.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md"
              >
                <p className="text-4xl font-black text-white sm:text-5xl">{item.value}</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/65">
                  <CheckCircle2 size={17} className="text-emerald-300" />
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
