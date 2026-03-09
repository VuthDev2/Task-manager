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
    <div className="flex min-h-screen bg-[#F3F4F9]">
      <Sidebar />

      <main className="flex-1 p-8">
        <UserHeader title="Notifications" />

        {/* Filters & Actions */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`text-sm font-bold pb-1 ${filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              All {notifications.length > 0 && `(${notifications.length})`}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`text-sm font-bold pb-1 ${filter === 'unread'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('archive')}
              className={`text-sm font-bold pb-1 ${filter === 'archive'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Archive
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications Feed */}
        <div className="max-w-4xl space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 font-black text-gray-400 italic">
              No notifications
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
    <div className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 relative overflow-hidden group border border-transparent hover:border-gray-100 ${notification.is_read ? 'opacity-60' : ''
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