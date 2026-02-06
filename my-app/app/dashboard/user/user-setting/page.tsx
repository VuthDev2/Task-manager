"use client";
import React from 'react';
import Sidebar from '../../../components/Sidebar';
import { User, Mail, Lock, EyeOff, Save, ShieldCheck } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account settings and security preferences.</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center border border-white">
              <div className="relative mb-4">
                <img 
                  src="/avatar.png" 
                  className="w-24 h-24 rounded-full bg-yellow-400 border-4 border-[#F3F4F9]" 
                  alt="Profile" 
                />
                <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <User size={14} />
                </button>
              </div>
              <h2 className="font-bold text-lg text-gray-900">Saravuth</h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Project Manager</p>
            </div>

            <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-200">
               <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck size={20} />
                 <span className="font-bold text-sm">Security Tip</span>
               </div>
               <p className="text-[11px] leading-relaxed opacity-90">
                 Keep your password strong by using a mix of letters, numbers, and symbols.
               </p>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white">
              <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Personal Information
              </h3>
              
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      defaultValue="saravuth20@gmail.com"
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      defaultValue="password123"
                      className="w-full bg-[#F3F4F9] border-none rounded-2xl py-4 pl-12 pr-12 font-semibold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 cursor-pointer hover:text-gray-500" size={18} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center gap-4">
                  <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95">
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-rose-600 text-sm">Sign out of all devices</h4>
                <p className="text-[11px] text-rose-400">Secure your account by ending all active sessions.</p>
              </div>
              <button className="bg-white text-rose-600 px-6 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest">
                Log Out
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}