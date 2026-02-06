"use client";
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Linkedin, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* TRUST HEADER */}
        <div className="text-center mb-32">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-8">
            A task manager you can <br /> trust for teams
          </h2>
          <p className="text-gray-400 font-bold text-sm tracking-wide">
            Plan projects, stay on track, and deliver on time without overworking your team.
          </p>
        </div>

        {/* MAIN LINKS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* Logo & Slogan */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-2xl font-black tracking-tighter text-gray-900">INFINITE</span>
            </div>
            <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[240px]">
              Stay organized and productive with INFINITE
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-3">
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-8">Explore</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
              <li className="hover:text-blue-600 cursor-pointer">Integration</li>
              <li className="hover:text-blue-600 cursor-pointer">Download</li>
              <li className="hover:text-blue-600 cursor-pointer">Blog</li>
              <li className="flex items-center gap-2">
                Features 
                <span className="bg-orange-100 text-orange-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">Soon!</span>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6">Keep in touch</h4>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 focus-within:border-purple-200 transition-all">
                <input 
                  type="email" 
                  placeholder="email address" 
                  className="bg-transparent flex-1 px-4 outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300" 
                />
                <button className="bg-[#8B5CF6] text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all">
                  Subscribe
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6">Follow us</h4>
              <div className="flex gap-4">
                <SocialCircle icon={Linkedin} />
                <SocialCircle icon={Facebook} />
                <SocialCircle icon={Twitter} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            Copyright © INFINITE 2026 · All Rights Reserved
          </p>
          <div className="flex items-center gap-10">
            <Link href="/login" className="text-xs font-black text-gray-400 hover:text-blue-600">Log In</Link>
            <Link href="/signup" className="bg-[#4169E1] text-white px-8 py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md">
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
    <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm cursor-pointer transition-all">
      <Icon size={20} />
    </div>
  );
}