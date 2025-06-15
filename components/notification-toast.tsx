'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, MessageCircle, Gift, User, Star } from 'lucide-react';
import SafeImage from './safe-image';

interface Notification {
  id: number;
  type: 'like' | 'message' | 'gift' | 'follow' | 'system';
  username: string;
  avatar: string;
  content: string;
  time: string;
  read: boolean;
}

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export default function NotificationToast({
  notification,
  onClose,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-pink-500" />;
      case 'message':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'gift':
        return <Gift size={16} className="text-purple-500" />;
      case 'follow':
        return <User size={16} className="text-green-500" />;
      case 'system':
        return <Star size={16} className="text-yellow-500" />;
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isVisible ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-20 right-4 z-50 md:w-80 w-[calc(100%-32px)] bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="flex items-center p-3">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <SafeImage
            src={notification.avatar}
            alt={notification.username}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="mr-1">
              {getNotificationIcon(notification.type)}
            </span>
            <p className="text-white text-sm font-medium truncate">
              <span className="font-semibold">{notification.username}</span>
            </p>
          </div>
          <p className="text-zinc-300 text-xs truncate">
            {notification.content}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <div className="h-1 bg-pink-500 animate-shrink"></div>
    </motion.div>
  );
}
