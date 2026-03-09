"use client";
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import Link from 'next/link';
import { Zap, Users, BarChart, Shield, Clock, Globe } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20 px-6">

        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-6">
              Powerful features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage projects and boost team productivity.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center bg-black text-white p-12 rounded-3xl">
            <h2 className="text-3xl font-bold mb-4">See it in action</h2>
            <p className="text-gray-300 mb-8">Watch a short demo or start using it now.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="./demo.mp4"
                className="border border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-black transition-all"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}