"use client";
import React from 'react';
import { Layout, Calendar, Users, BarChart3, CheckCircle2 } from 'lucide-react';

const featureData = [
  { 
    title: "Agile Task Tracking", 
    desc: "Visualize workflow progress with real-time status updates and automated dependencies.", 
    bg: "bg-[#FFFCE6]", 
    accent: "text-orange-500",
    icon: <Layout className="w-6 h-6" />
  },
  { 
    title: "Smart Resource Planning", 
    desc: "Coordinate team bandwidth across projects with an integrated, drag-and-drop calendar.", 
    bg: "bg-[#F5F0FF]", 
    accent: "text-purple-600",
    icon: <Calendar className="w-6 h-6" />
  },
  { 
    title: "Team Sync & Collab", 
    desc: "Centralize communication with thread-based comments and shared document workspaces.", 
    bg: "bg-[#E6F9FF]", 
    accent: "text-blue-600",
    icon: <Users className="w-6 h-6" />
  }
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</p>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Powerful features for <br /> modern project teams.
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-xs pb-2">
            Engineered to remove friction from project delivery and boost collective output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featureData.map((f, i) => (
            <div key={i} className={`${f.bg} rounded-[2.5rem] p-10 h-[500px] border border-white shadow-sm flex flex-col hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group overflow-hidden relative`}>
              
              {/* Icon & Title */}
              <div className="relative z-10">
                <div className={`${f.accent} mb-6 p-3 bg-white w-fit rounded-2xl shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                <p className="text-sm font-bold text-gray-500/80 leading-relaxed mb-8">{f.desc}</p>
              </div>
              
              {/* Refined Task Manager UI Mockup */}
              <div className="mt-auto bg-white/80 backdrop-blur-md rounded-2xl h-56 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)] border border-white translate-y-8 group-hover:translate-y-2 transition-transform duration-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <BarChart3 className="w-4 h-4 text-gray-300" />
                </div>
                
                {/* Simulated Task List */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${item === 1 ? 'text-green-500' : 'text-gray-100'}`} />
                      <div className={`h-2 rounded-full bg-gray-50 ${item === 1 ? 'w-full' : 'w-3/4'}`} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 border border-white" />
                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-white" />
                  </div>
                  <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    IN PROGRESS
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/40 blur-3xl rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}