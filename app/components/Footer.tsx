"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Facebook, Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (

    <footer className="bg-[#F8F9FD] pt-32 pb-16 border-t-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">
            Manage your teams <br /> like never before.
          </h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
            Plan projects, stay on track, and deliver on time without overworking your team. Join the future of productivity.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-black text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
          >
            Get Started Free
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* LOGO & BRANDING */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 overflow-hidden flex items-center justify-center">
                <Image 
                  src="/logo.jpg" 
                  alt="Infinite Corporate Logo"
                  fill
                  className="object-contain mix-blend-multiply scale-125"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                INFINITE
              </span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              The only task management platform that balances team bandwidth with high-impact project delivery.
            </p>
            <div className="flex gap-4">
              <SocialCircle icon={Linkedin} />
              <SocialCircle icon={Facebook} />
              <SocialCircle icon={Twitter} />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-3">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li className="hover:text-black transition-colors cursor-pointer">Pricing Plans</li>
              <li className="hover:text-black transition-colors cursor-pointer">App Integrations</li>
              <li className="hover:text-black transition-colors cursor-pointer">Desktop Download</li>
              <li className="hover:text-black transition-colors cursor-pointer">Product Roadmap</li>
              <li className="flex items-center gap-2">
                Enterprise 
                <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Soon</span>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER SECTION */}
          <div className="lg:col-span-5">
            <h4 className="font-black text-xs text-gray-900 uppercase tracking-[0.2em] mb-8">Stay Updated</h4>
            <div className="bg-white p-2 rounded-2xl border-2 border-gray-100 focus-within:border-black transition-all flex shadow-sm">
              <input 
                type="email" 
                placeholder="Work email address" 
                className="bg-transparent flex-1 px-4 outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300" 
              />
              <button className="bg-black text-white p-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center">
                <Send size={18} />
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-400 font-medium">
              Join 2,000+ teams receiving monthly productivity insights.
            </p>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              © 2026 INFINITE · COPORATE
            </p>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">Privacy</Link>
              <Link href="#" className="text-[11px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em]">Terms</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Log In</Link>
            <Link 
              href="/signup" 
              className="bg-white text-black border-2 border-black px-8 py-2.5 rounded-full text-xs font-black hover:bg-black hover:text-white transition-all shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialCircle({ icon: Icon }: any) {
  return (
    <div className="w-11 h-11 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:bg-black hover:border-black cursor-pointer transition-all shadow-sm">
      <Icon size={18} />
    </div>
  );
}