"use client";
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, BarChart, CheckCircle2, Clock, Globe, Shield, Users, Zap } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning fast',
      description: 'Optimized for speed with instant updates and no lag.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
    },
    {
      icon: Users,
      title: 'Team collaboration',
      description: 'Assign tasks, leave comments, and work together seamlessly.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: BarChart,
      title: 'Advanced analytics',
      description: 'Track progress with visual reports and insights.',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      icon: Shield,
      title: 'Enterprise security',
      description: 'Your data is safe with us. SOC2 compliant and encrypted.',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Clock,
      title: 'Time tracking',
      description: 'Monitor how long tasks take and improve estimates.',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      icon: Globe,
      title: 'Works anywhere',
      description: 'Access your tasks from any device, anywhere in the world.',
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">
          <section className="mb-8 rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-10 lg:rounded-[2.5rem] lg:p-14">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-indigo-600">Features</p>
            <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl">
              Everything your team needs, organized in one place.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Infinite keeps planning, collaboration, reporting, and security clean enough for daily work and powerful enough for growing teams.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 transition-transform group-hover:scale-105`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-black text-gray-950 mb-2">{feature.title}</h3>
                  <p className="text-sm leading-7 text-gray-500">{feature.description}</p>
                </div>
              );
            })}
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[2rem] bg-gray-950 p-8 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Daily workflow</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">From planning to proof.</h2>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Each feature is tuned to reduce the small messes that slow a project down: missed owners, unclear deadlines, scattered updates, and stale reporting.
              </p>
            </div>
            <div className="grid gap-3 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:grid-cols-2">
              {['Assign work clearly', 'Track task state', 'Review progress', 'Report results'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 text-sm font-bold text-gray-700">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-10">
            <h2 className="text-3xl font-black text-gray-950">See it in action</h2>
            <p className="mt-3 text-gray-500">Watch a short demo or start using it now.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-8 py-4 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                href="/demo.mp4"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-4 text-sm font-black text-gray-800 transition hover:border-gray-950"
              >
                Watch Demo
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
