import { getUserNotifications } from '@/app/lib/notification-actions';
import NotificationsClient from './NotificationsClient';

export default async function NotificationsPage() {
  const notifications = await getUserNotifications();
  return <NotificationsClient initialNotifications={notifications} />;
}