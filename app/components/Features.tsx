"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Calendar, Users, BarChart3, CheckCircle2 } from 'lucide-react';

const featureData = [
  {
    title: "Agile Task Tracking",
    desc: "Visualize workflow progress with real-time status updates and automated dependencies.",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
    accent: "text-orange-500",
    icon: Layout,
  },
  {
    title: "Smart Resource Planning",
    desc: "Coordinate team bandwidth across projects with an integrated, drag-and-drop calendar.",
    bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
    accent: "text-purple-600",
    icon: Calendar,
  },
  {
    title: "Team Sync & Collab",
    desc: "Centralize communication with thread-based comments and shared document workspaces.",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    accent: "text-blue-600",
    icon: Users,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient orbs (similar to Hero) */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center md:text-left md:flex md:items-end justify-between gap-8 mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Powerful features for <br /> modern project teams.
            </h2>
          </div>
          <p className="text-gray-500 font-medium max-w-xs mt-4 md:mt-0 pb-2">
            Engineered to remove friction from project delivery and boost collective output.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
        >
          {featureData.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`${f.bg} rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 min-h-[430px] lg:h-[500px] border border-white/50 shadow-lg backdrop-blur-sm flex flex-col hover:shadow-2xl transition-all duration-500 group overflow-hidden relative`}
              >
                {/* Inner glass layer */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2.5rem] pointer-events-none" />

                <div className="relative z-10">
                  <div className={`${f.accent} mb-6 p-3 bg-white/80 backdrop-blur-sm w-fit rounded-2xl shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed mb-8">{f.desc}</p>
                </div>

                {/* Animated mockup (slightly refined) */}
                <motion.div
                  initial={{ y: 20 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 mt-auto bg-white/80 backdrop-blur-md rounded-2xl h-52 sm:h-56 shadow-lg border border-white/50 p-5 sm:p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 ${item === 1 ? 'text-green-500' : 'text-gray-200'}`}
                        />
                        <div className={`h-2 rounded-full bg-gray-100 ${item === 1 ? 'w-full' : 'w-3/4'}`} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 border border-white" />
                      <div className="w-6 h-6 rounded-full bg-blue-200 border border-white" />
                    </div>
                    <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      IN PROGRESS
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
