"use client";
import React from 'react';
import { 
  CheckSquare, 
  Shapes, 
  Users, 
  BarChart3, 
  Settings2, 
  LogOut 
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';

const adminItems = [
  { 
    icon: CheckSquare, 
    label: 'All Tasks', 
    href: '/admin/admin-tasks' 
  },
  { 
    icon: Shapes, 
    label: 'Categories', 
    href: '/admin/admin-cate' 
  },
  { 
    icon: Users, 
    label: 'All Users', 
    href: '/admin/admin-users' 
  },
  { 
    icon: BarChart3, 
    label: 'Reports', 
    href: '/admin/admin-reports' 
  },
  { 
    icon: Settings2, 
    label: 'Settings', 
    href: '/admin/admin-setting' 
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white flex flex-col border-r border-gray-100 h-screen sticky top-0 shrink-0 max-md:fixed max-md:bottom-0 max-md:top-auto max-md:z-[90] max-md:h-auto max-md:w-full max-md:border-r-0 max-md:border-t max-md:shadow-[0_-12px_30px_rgba(15,23,42,0.08)]">
      {/* Brand Logo - Matches User Sidebar exactly */}
      <div className="max-md:hidden">
        <Logo />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 max-md:mt-0 max-md:grid max-md:grid-cols-5 max-md:overflow-x-auto max-md:px-2 max-md:py-2">
        {adminItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-8 py-4 transition-all group max-md:min-w-0 max-md:flex-col max-md:justify-center max-md:gap-1 max-md:rounded-2xl max-md:px-2 max-md:py-3 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 max-md:border-r-0 max-md:border-t-2' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon 
                size={20} 
                className={isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'} 
              />
              <span className="font-semibold text-sm max-md:text-[10px] max-md:leading-tight max-md:truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 max-md:hidden">
        <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-semibold text-sm">
          <LogOut size={18} />
          Logout Admin
        </button>
      </div>
    </aside>
  );
}
