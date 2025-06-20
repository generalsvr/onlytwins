'use client';

import {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import SafeImage from './safe-image';
import NotificationToast from './notification-toast';
import { useNotificationStore } from '@/lib/stores/notificationStore';

interface Notification {
  id: number;
  type: 'like' | 'message' | 'gift' | 'follow' | 'system';
  username: string;
  avatar: string;
  content: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    username: 'claire',
    avatar: '/claire-profile.png',
    content: 'liked your photo',
    time: '2m ago',
    read: false,
  },
  {
    id: 2,
    type: 'message',
    username: 'jennypinky',
    avatar: '/jennypinky-profile.png',
    content: 'sent you a new message',
    time: '15m ago',
    read: false,
  },
  {
    id: 3,
    type: 'gift',
    username: 'twins',
    avatar: '/valeria-camila-profile.png',
    content: 'sent you a gift',
    time: '1h ago',
    read: false,
  },
  {
    id: 4,
    type: 'follow',
    username: 'lee',
    avatar: '/lee-profile.png',
    content: 'started following you',
    time: '3h ago',
    read: true,
  },
  {
    id: 5,
    type: 'system',
    username: 'OnlyTwins',
    avatar: '/app-icon.png',
    content: 'Welcome to OnlyTwins! Complete your profile to get started.',
    time: '1d ago',
    read: true,
  },
];



export default function NotificationsCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(notifications);
  const { theme } = useTheme();
  const { toastNotification, dismissToastNotification } = useNotificationStore();

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };



  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
      <div className="relative z-50">
        <button
            className="relative p-2 flex items-center justify-center"
            onClick={toggleNotifications}
            aria-label="Notifications"
        >
          <Bell
              size={24}
              className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}
          />
          {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-xs text-white">
            {unreadCount}
          </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
              <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-[60] md:hidden"
                    onClick={() => setIsOpen(false)}
                />

                <motion.div
                    initial={{
                      y: window.innerWidth >= 768 ? -20 : '-100%',
                      opacity: window.innerWidth >= 768 ? 0 : 1,
                      scale: window.innerWidth >= 768 ? 0.95 : 1,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      y: window.innerWidth >= 768 ? -20 : '-100%',
                      opacity: window.innerWidth >= 768 ? 0 : 1,
                      scale: window.innerWidth >= 768 ? 0.95 : 1,
                    }}
                    transition={{ type: 'spring', damping: 30 }}
                    drag={window.innerWidth < 768 ? 'y' : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100) {
                        setIsOpen(false);
                      }
                    }}
                    className={`
                ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-900'} 
                shadow-xl overflow-hidden z-[70]
                md:absolute md:top-12 md:right-0 md:w-96 md:rounded-lg md:border md:border-zinc-700
                fixed top-0 left-0 right-0 h-auto max-h-[90vh] md:max-h-[80vh]
              `}
                >
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <div className="flex items-center space-x-4">
                      {unreadCount > 0 && (
                          <button
                              className="text-sm text-pink-500"
                              onClick={markAllAsRead}
                          >
                            Mark all as read
                          </button>
                      )}
                      <button
                          onClick={() => setIsOpen(false)}
                          className="text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center py-1 border-b border-zinc-800 md:hidden">
                    <div className="w-12 h-1 bg-zinc-600 rounded-full"></div>
                  </div>

                  <div className="overflow-y-auto max-h-[calc(90vh-60px)] md:max-h-[60vh]">
                    {notifs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 p-4">
                          <Bell size={48} className="text-zinc-500 mb-4" />
                          <p className="text-zinc-500 text-center">
                            No notifications yet
                          </p>
                        </div>
                    ) : (
                        <div>
                          {notifs.map((notification) => (
                              <div
                                  key={notification.id}
                                  className={`p-4 border-b border-zinc-800 flex items-center ${
                                      !notification.read ? 'bg-opacity-10 bg-pink-500' : ''
                                  }`}
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                  <SafeImage
                                      src={notification.avatar}
                                      alt={notification.username}
                                      width={40}
                                      height={40}
                                      className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white">
                            <span className="font-semibold">
                              {notification.username}
                            </span>{' '}
                                    {notification.content}
                                  </p>
                                  <p className="text-xs text-zinc-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                          ))}

                          {/*<div className="p-4 border-t border-zinc-800">*/}
                          {/*  <h3 className="text-sm font-medium text-zinc-400 mb-3">*/}
                          {/*    Suggested Profiles*/}
                          {/*  </h3>*/}
                          {/*  <div className="flex overflow-x-auto space-x-3 py-2">*/}
                          {/*    {suggestedProfiles.map((profile) => (*/}
                          {/*        <div key={profile.id} className="flex-shrink-0">*/}
                          {/*          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 p-0.5">*/}
                          {/*            <SafeImage*/}
                          {/*                src={profile.avatar}*/}
                          {/*                alt={profile.name}*/}
                          {/*                width={64}*/}
                          {/*                height={64}*/}
                          {/*                className="rounded-full object-cover"*/}
                          {/*            />*/}
                          {/*          </div>*/}
                          {/*          <p className="text-xs text-center text-zinc-400 mt-1">*/}
                          {/*            {profile.name}*/}
                          {/*          </p>*/}
                          {/*        </div>*/}
                          {/*    ))}*/}
                          {/*  </div>*/}
                          {/*</div>*/}
                        </div>
                    )}
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
        {toastNotification && (
            <NotificationToast
                notification={toastNotification}
                onClose={dismissToastNotification}
            />
        )}
      </div>
  );
}