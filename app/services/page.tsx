"use client";
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle, MessageSquareText, PlugZap, Rows3 } from 'lucide-react';

export default function ServicesPage() {
  // ... (services remain same)
  const services = [
    {
      title: 'Project Management',
      description: 'Plan, track, and deliver projects with ease. Kanban boards, timelines, and task dependencies all in one place.',
      features: ['Custom workflows', 'Milestone tracking', 'Resource allocation'],
      icon: Rows3,
    },
    {
      title: 'Team Collaboration',
      description: 'Keep everyone on the same page with real‑time updates, comments, and file sharing.',
      features: ['Team chat', 'File attachments', 'Mentions & notifications'],
      icon: MessageSquareText,
    },
    {
      title: 'Analytics & Reporting',
      description: 'Get insights into your team’s productivity with custom reports and dashboards.',
      features: ['Burndown charts', 'Velocity tracking', 'Exportable reports'],
      icon: BarChart3,
    },
    {
      title: 'Integrations',
      description: 'Connect with the tools you already use, like Slack, GitHub, and Google Calendar.',
      features: ['Two‑way sync', 'Webhooks', 'API access'],
      icon: PlugZap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">
          <section className="mb-8 grid gap-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:rounded-[2.5rem] lg:p-14">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-indigo-600">Services</p>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl">
                Professional support for better project delivery.
            </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                Organize projects, improve collaboration, measure momentum, and connect the tools your team already uses.
            </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-7 py-4 text-sm font-black text-white shadow-lg transition hover:bg-indigo-700"
            >
              Start free <ArrowRight size={18} />
            </Link>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
              <div
                key={service.title}
                className="rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-black text-gray-950 mb-3">{service.title}</h3>
                <p className="text-sm leading-7 text-gray-500 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </section>

          <section className="mt-8 rounded-[2rem] bg-gray-950 p-6 text-center text-white shadow-sm sm:p-10">
            <h2 className="text-3xl font-black">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/65">Join teams using Infinite to manage work with cleaner planning, faster updates, and better visibility.</p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-gray-950 transition hover:bg-indigo-100"
            >
              Start your free trial <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
