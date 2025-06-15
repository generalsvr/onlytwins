'use client';

import { useRef, useEffect } from 'react';
import { Home, Search, MessageCircle, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';

interface EnhancedNavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function EnhancedNavigation({
  activePage,
  setActivePage,
}: EnhancedNavigationProps) {
  const navItems = [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'messages', icon: MessageCircle, label: 'Chat' },
    { id: 'wallet', icon: Heart, label: 'Likes' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Update indicator position when active page changes
  useEffect(() => {
    updateIndicatorPosition();
  }, [activePage]);

  // Update indicator position on window resize
  useEffect(() => {
    window.addEventListener('resize', updateIndicatorPosition);
    return () => window.removeEventListener('resize', updateIndicatorPosition);
  }, []);

  const updateIndicatorPosition = () => {
    if (!navRef.current || !indicatorRef.current) return;

    const navRect = navRef.current.getBoundingClientRect();
    const navWidth = navRect.width;
    const itemWidth = navWidth / navItems.length;

    const activeIndex = navItems.findIndex((item) => item.id === activePage);
    if (activeIndex === -1) return;

    const indicatorWidth = itemWidth * 0.5;
    const indicatorLeft =
      itemWidth * activeIndex + (itemWidth - indicatorWidth) / 2;

    indicatorRef.current.style.width = `${indicatorWidth}px`;
    indicatorRef.current.style.left = `${indicatorLeft}px`;
  };

  return (
    <div
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-t border-zinc-800 z-50 flex justify-around items-center"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            activePage === item.id ? 'text-pink-500' : 'text-zinc-400'
          }`}
          onClick={() => setActivePage(item.id)}
          aria-label={item.label}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <item.icon size={24} />
          </motion.div>
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
      <div
        ref={indicatorRef}
        className="absolute bottom-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-md transition-all duration-300"
      />
    </div>
  );
}
