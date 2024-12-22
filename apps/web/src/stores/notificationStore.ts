import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'mention' | 'discussion' | 'message' | 'event';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  tribeId: string;
  sourceId: string; // ID of the discussion/event/message
  sourceType: 'discussion' | 'event' | 'message' | 'comment';
  sender: {
    id: string;
    displayName: string;
    avatar: string;
  };
  recipient: {
    id: string;
    displayName: string;
  };
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (tribeId: string) => void;
  getNotificationsByTribe: (tribeId: string) => Notification[];
  getUnreadNotifications: (tribeId: string) => Notification[];
  deleteNotification: (notificationId: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        };

        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),

      markAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: state.unreadCount - 1,
      })),

      markAllAsRead: (tribeId) => set((state) => {
        const unreadCount = state.notifications.filter(
          (n) => n.tribeId === tribeId && !n.read
        ).length;

        return {
          notifications: state.notifications.map((notification) =>
            notification.tribeId === tribeId
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: state.unreadCount - unreadCount,
        };
      }),

      getNotificationsByTribe: (tribeId) => {
        return get().notifications
          .filter((notification) => notification.tribeId === tribeId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadNotifications: (tribeId) => {
        return get().notifications
          .filter((notification) => notification.tribeId === tribeId && !notification.read)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      deleteNotification: (notificationId) => set((state) => {
        const notification = state.notifications.find((n) => n.id === notificationId);
        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount: notification && !notification.read 
            ? state.unreadCount - 1 
            : state.unreadCount,
        };
      }),
    }),
    {
      name: 'notification-storage',
    }
  )
);
