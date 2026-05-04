"use client";
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Globe2, Layers3, Target } from 'lucide-react';

const stats = [
  { value: '10k+', label: 'Active users' },
  { value: '50k+', label: 'Tasks completed' },
  { value: '4.9', label: 'Average rating' },
];

const principles = [
  {
    icon: Target,
    title: 'Focus first',
    text: 'Every screen is designed to make the next priority obvious without crowding the workspace.',
  },
  {
    icon: Layers3,
    title: 'Useful structure',
    text: 'Projects, categories, and reports stay organized so teams can move quickly with less admin work.',
  },
  {
    icon: Globe2,
    title: 'Built for real teams',
    text: 'Infinite supports quick mobile check-ins, focused desktop planning, and everything between.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">
          <section className="grid gap-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:rounded-[2.5rem] lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-indigo-600">About Infinite</p>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl">
                Calm project control for busy teams.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                We are building a task manager that helps teams plan clearly, communicate faster, and deliver dependable work without turning every day into a scramble.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] bg-gray-100 lg:min-h-[460px]"
            >
              <Image
                src="/team.png"
                alt="Team collaborating on a project"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <p className="text-4xl font-black text-gray-950">{item.value}</p>
                <p className="mt-2 text-sm font-bold text-gray-500">{item.label}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-lg font-black text-gray-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-8 rounded-[2rem] bg-gray-950 p-6 text-white sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Work should feel easier to understand.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                  Infinite brings planning, task ownership, notifications, and reports into one organized workspace.
                </p>
              </div>
              <div className="grid gap-3 text-sm font-bold text-white/80 sm:grid-cols-3 lg:grid-cols-1">
                {['Cleaner handoffs', 'Visible priorities', 'Less status chasing'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-emerald-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
          </div>
      </main>
      <Footer />
    </div>
  );
}
