"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import UserHeader from '@/app/components/UserHeader';
import {
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  X,
  MoreHorizontal
} from 'lucide-react';
import { markAsRead, markAllAsRead, dismissNotification } from '@/app/lib/notification-actions';
import { createClient } from '@/src/utils/supabase/client';

interface Notification {
  id: number;
  type: string;
  sender: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsClient({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archive'>('all');
  const supabase = createClient();

  // Real‑time subscription for new notifications
  useEffect(() => {
    const fetchUserAndSubscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    fetchUserAndSubscribe();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleDismiss = async (id: number) => {
    await dismissNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'archive') return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-[#F6F7FB]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <UserHeader title="Notifications" />

        <section className="mb-6 rounded-[1.75rem] border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Inbox</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-950">Stay aware without losing focus.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
            Review updates, clear completed messages, and keep unread items visible.
          </p>
        </section>

        {/* Filters & Actions */}
        <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-2 text-sm font-black ${filter === 'all'
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
            >
              All {notifications.length > 0 && `(${notifications.length})`}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`rounded-full px-4 py-2 text-sm font-black ${filter === 'unread'
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('archive')}
              className={`rounded-full px-4 py-2 text-sm font-black ${filter === 'archive'
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
            >
              Archive
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-black text-indigo-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications Feed */}
        <div className="max-w-4xl space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
              <p className="text-lg font-black text-gray-900">No notifications</p>
              <p className="mt-2 text-sm font-semibold text-gray-400">You are all caught up.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={() => handleMarkAsRead(notification.id)}
                onDismiss={() => handleDismiss(notification.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function NotificationItem({ notification, onMarkRead, onDismiss }: {
  notification: Notification;
  onMarkRead: () => void;
  onDismiss: () => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'new': return <CheckCircle2 size={18} className="text-blue-500" />;
      case 'task': return <RefreshCcw size={18} className="text-green-500" />;
      case 'update': return <AlertCircle size={18} className="text-orange-500" />;
      case 'alert': return <X size={18} className="text-rose-500" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const statusColor =
    notification.type === 'new' ? 'bg-blue-500' :
      notification.type === 'task' ? 'bg-green-500' :
        notification.type === 'update' ? 'bg-orange-500' :
          notification.type === 'alert' ? 'bg-rose-500' :
            'bg-gray-500';

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`relative flex items-start gap-4 overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md group ${notification.is_read ? 'opacity-70' : ''
      }`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`} />

      <div className={`p-2 rounded-xl bg-gray-50`}>
        {getIcon()}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-gray-900 text-sm tracking-tight">{notification.sender}</h4>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
            {timeAgo(notification.created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {notification.message}
        </p>

        <div className="flex items-center gap-6">
          {!notification.is_read && (
            <button
              onClick={onMarkRead}
              className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest"
          >
            Dismiss
          </button>
        </div>
      </div>

      <button className="text-gray-300 hover:text-gray-600 self-start">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
}
