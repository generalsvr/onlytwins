import { create } from 'zustand';

interface Notification {
  id: number;
  type: 'like' | 'message' | 'gift' | 'follow' | 'system';
  username: string;
  avatar: string;
  content: string;
  time: string;
  read: boolean;
}

interface NotificationState {
  toastNotification: Notification | null;
  setToastNotification: (notification: Notification | null) => void;
  dismissToastNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toastNotification: null,
  setToastNotification: (notification) =>
    set({ toastNotification: notification }),
  dismissToastNotification: () => set({ toastNotification: null }),
}));
