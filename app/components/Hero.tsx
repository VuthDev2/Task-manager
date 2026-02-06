"use client";
import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="relative bg-[#F3F4F9] pt-32 pb-20 overflow-hidden">
      {/* STICKY NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-black tracking-tighter text-gray-900 hidden sm:block">INFINITE</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-gray-400">
            {['Home', 'About', 'Services', 'Features'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-blue-600 px-4 hover:text-blue-800 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-[#4F46E5] text-white px-7 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-8 text-center relative z-10 mt-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 leading-[1.05] mb-8">
          Manage Your 
          <span className="inline-flex items-center align-middle mx-4 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gray-900 text-[10px] text-white flex items-center justify-center border-2 border-white font-bold">2+</div>
            </div>
          </span>
          Team's <br />
          <span className="relative inline-block mt-4 italic">
            Productivity
            <div className="absolute bottom-6 left-0 w-full h-4 bg-blue-600/10 -rotate-1 z-[-1] rounded-full" />
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg font-bold max-w-xl mx-auto mb-12 leading-relaxed">
          Plan projects, stay on track, and deliver on time without overworking your team.
        </p>

        <button className="bg-[#7C3AED] text-white px-10 py-4.5 rounded-full font-bold flex items-center gap-3 mx-auto shadow-2xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Play size={12} fill="white" />
          </div>
          Get Started
        </button>
      </div>
    </section>
  );
}