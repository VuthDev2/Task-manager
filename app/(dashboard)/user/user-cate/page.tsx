"use client";
import React from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Search, Plus, User, Briefcase, Folder, 
  MoreVertical, Pencil, Trash2, ChevronDown 
} from 'lucide-react';

export default function Categories() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Unified Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-blue-100 outline-none" 
              />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right">
                <p className=" font-bold text-gray-900"> Saravuth</p>
                <p className="text-[10px] text-gray-500 font-semibold uppercase">PROJECT MANAGER</p>
              </div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <button className="bg-[#B8E2E8] text-[#2D5A61] px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-[#a5d7de] transition-all shadow-sm active:scale-95">
            <Plus size={20} />
            Add New Category
          </button>
          
          <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">3</span> Categories
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard 
            title="Personal Task" 
            icon={User} 
            projectName="Total Transactions"
            description="Total the summary of the expenses for this month at the end of the month."
            color="bg-blue-500"
          />
          <CategoryCard 
            title="Project" 
            icon={Folder} 
            projectName="Scanning system"
            description="Build a scanning system for a factory at Phnom Penh with more than 10,000 employees."
            color="bg-sky-500"
          />
          <CategoryCard 
            title="Work" 
            icon={Briefcase} 
            projectName="Mobile App"
            description="Build a car selling app for client with priority model 2025 and 2026, mostly BYD cars."
            color="bg-indigo-500"
          />
        </div>
      </main>
    </div>
  );
}

function CategoryCard({ title, icon: Icon, projectName, description, color }: any) {
  return (
    <div className="flex flex-col gap-4 group">
      {/* Category Label Button */}
      <div className={`flex items-center justify-between ${color} text-white px-5 py-3 rounded-2xl shadow-md cursor-pointer hover:brightness-110 transition-all`}>
        <div className="flex items-center gap-3">
          <Icon size={18} />
          <span className="font-bold text-sm tracking-wide">{title}</span>
        </div>
        <ChevronDown size={16} className="opacity-70" />
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white hover:shadow-xl hover:border-blue-50 transition-all duration-300 relative min-h-[280px] flex flex-col justify-between">
        <div>
          <h3 className="text-center font-bold text-gray-900 mb-6 text-lg tracking-tight">
            {projectName}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed text-center px-2">
            {description}
          </p>
        </div>

        {/* Professional Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}