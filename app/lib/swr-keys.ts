export const SWR_KEYS = {
  tasks: 'tasks',
  categories: 'categories',
  users: 'users',
  notifications: 'notifications',
  unreadCount: 'unreadCount',
  profile: (userId: string) => `profile-${userId}`,
};