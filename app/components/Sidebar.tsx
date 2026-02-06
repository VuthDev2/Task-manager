"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Layers, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo'; // Importing your new consistent logo

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/user/user-dashboard' },
  { icon: Calendar, label: 'My Tasks', href: '/user/user-tasks' },
  { icon: Layers, label: 'Categories', href: '/user/user-cate' },
  { icon: Bell, label: 'Notification', href: '/user/user-notification' },
  { icon: Settings, label: 'Settings', href: '/user/user-setting' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-gray-100 h-screen sticky top-0">
      
      {/* FEATURE PRESERVED: Consistent Logo via Logo.tsx */}
      <Logo />

      {/* FEATURE PRESERVED: Dynamic Navigation Links */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          // FEATURE PRESERVED: Active state detection using usePathname
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-8 py-4 transition-all group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {/* FEATURE PRESERVED: Icon color shifting on active/hover */}
              <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'} />
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FEATURE PRESERVED: Professional Logout with hover states */}
      <div className="p-6">
        <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-semibold text-sm">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}