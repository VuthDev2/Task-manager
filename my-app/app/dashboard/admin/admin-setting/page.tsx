"use client";
import React from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ShieldCheck, 
  BellRing, 
  Globe,
  Save
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Configure your admin profile</p>
          </div>
          <button className="bg-black text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs hover:bg-gray-800 transition-all shadow-lg active:scale-95">
            <Save size={16} />
            Save Changes
          </button>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Profile Overview Card */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white text-center relative overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0" />
              
              <div className="relative z-10">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-[2rem] bg-yellow-400 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-gray-800">
                    S
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-black text-white p-2 rounded-xl border-2 border-white hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">Saravuth</h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Super Admin</p>
                
                <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase">Status</span>
                    <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase">Member Since</span>
                    <span className="text-gray-900">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Bento */}
            <div className="bg-[#1A1D21] rounded-[2rem] p-6 text-white shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Preference</h3>
              <div className="space-y-4">
                <PreferenceItem icon={BellRing} label="Notifications" active />
                <PreferenceItem icon={ShieldCheck} label="Two-Factor Auth" active={false} />
                <PreferenceItem icon={Globe} label="Language" value="English" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-white">
              <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                <User size={20} className="text-blue-600" /> Account Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="email" 
                      defaultValue="saravuth@infinite.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="+855 12 345 678"
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50">
                <button className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-6 py-3 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                  Deactivate Admin Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function PreferenceItem({ icon: Icon, label, active, value }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors">
          <Icon size={16} />
        </div>
        <span className="text-xs font-bold text-gray-300">{label}</span>
      </div>
      {value ? (
        <span className="text-[10px] font-black text-gray-500 uppercase">{value}</span>
      ) : (
        <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
        </div>
      )}
    </div>
  );
}