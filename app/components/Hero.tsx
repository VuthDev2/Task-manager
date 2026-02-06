"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-[#F8F9FD] pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* STICKY NAVBAR - Bolder BG and Border */}
      <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-24 flex justify-between items-center">
          
          {/* LOGO SECTION - BIGGER LOGO */}
          <div className="flex items-center gap-4 group cursor-pointer">
            {/* Increased from w-10 h-10 to w-16 h-16 */}
            <div className="relative w-16 h-16 overflow-hidden flex items-center justify-center">
              <Image 
                src="/logo.jpg" 
                alt="Infinite Corporate Logo"
                fill
                className="object-contain mix-blend-multiply scale-125"
              />
            </div>
            {/* Increased text size to 2xl to match logo */}
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              INFINITE
            </span>
          </div>
          
          {/* CENTER NAV */}
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-gray-500">
            {['Home', 'About', 'Services', 'Features'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-black transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-black transition-colors">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-8 text-center relative z-10 mt-20">
        {/* SMALL BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          NEW: AI PRODUCTIVITY DASHBOARD
        </div>

        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight text-gray-900 leading-[1.1] mb-8">
          Manage Your 
          <span className="inline-flex items-center align-middle mx-4 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 rotate-2 hover:rotate-0 transition-transform cursor-default">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
              <div className="w-12 h-12 rounded-full bg-rose-500 border-4 border-white shadow-sm" />
              <div className="w-12 h-12 rounded-full bg-gray-900 text-xs text-white flex items-center justify-center border-4 border-white font-bold">2+</div>
            </div>
          </span>
          Team's <br />
          <span className="relative inline-block mt-4 italic font-serif text-indigo-600">
            Productivity
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 15C50 5 150 5 295 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="opacity-20" />
            </svg>
          </span>
        </h1>
        
        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          Plan projects, stay on track, and deliver on time <br className="hidden md:block" />
          without overworking your team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center gap-3 shadow-2xl hover:bg-gray-800 transition-all active:scale-95 group">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play size={10} fill="white" />
            </div>
            Get Started Free
          </button>
          <button className="px-10 py-5 rounded-full font-bold text-gray-600 hover:text-black hover:bg-gray-100 transition-all">
            View Demo
          </button>
        </div>
      </div>

      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
    </section>
  );
}