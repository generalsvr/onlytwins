'use client';

import { useRef, useEffect } from 'react';
import { Home, Search, MessageCircle, DollarSign, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import useWindowSize from '@/lib/hooks/useWindowSize';

export default function MainNavigation() {
  const { isAuthenticated } = useAuthStore();
  const { isMobile } = useWindowSize();
  const baseNavItems = [
    { id: 'feed', icon: Home, label: 'Feed', path: '/' },
    { id: 'chats', icon: MessageCircle, label: 'Chat', path: '/chats' },
    // { id: 'explore', icon: Search, label: 'Explore', path: '/explore' },
  ];

  const authNavItems = [
    { id: 'earn', icon: DollarSign, label: 'Earn', path: '/earn' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = isAuthenticated
    ? [...baseNavItems, ...authNavItems]
    : [...baseNavItems];

  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Get the active page ID from the pathname
  const activePage = pathname.split('/')[1] ? pathname.split('/')[1] : 'feed';

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = navRef.current?.querySelector(
        `button[data-id="${activePage}"], button[data-id="chats"][data-active="true"]`
      ) as HTMLButtonElement;

      if (activeButton && indicatorRef.current) {
        const { offsetTop, offsetLeft, offsetHeight, offsetWidth } =
          activeButton;

        if (isMobile) {
          // Mobile: horizontal bar on top
          indicatorRef.current.style.width = `${offsetWidth - 20}px`;
          indicatorRef.current.style.height = '2px';
          indicatorRef.current.style.left = `${offsetLeft + 10}px`;
          indicatorRef.current.style.top = '0';
        } else {
          // Desktop: vertical bar on the left
          indicatorRef.current.style.width = '4px';
          indicatorRef.current.style.height = `${offsetHeight}px`;
          indicatorRef.current.style.left = '0';
          indicatorRef.current.style.top = `${offsetTop}px`;
        }
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activePage, isMobile]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div
      ref={navRef}
      className={`z-50 bg-black bg-opacity-80 backdrop-blur-md border-zinc-800 rounded-2xl ${
        isMobile
          ? 'fixed bottom-0 left-0 right-0 h-16 border-t flex justify-around items-center'
          : 'fixed top-1/2 right-0 transform -translate-y-1/2 w-20 h-auto border-l flex flex-col justify-center items-center'
      }`}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          data-id={item.id}
          data-active={
            item.id === 'chats' && pathname.includes('chat/') ? 'true' : 'false'
          }
          className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center ${
            isMobile ? 'flex-1 h-full' : 'w-full h-20 my-2'
          } ${activePage === item.id || (item.id === 'chats' && pathname.includes('chat/')) ? 'text-pink-500' : 'text-zinc-400'}`}
          onClick={() => handleNavigate(item.path)}
          aria-label={item.label}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <item.icon size={isMobile ? 24 : 28} />
          </motion.div>
          <span className={`text-xs mt-1 ${isMobile ? 'block' : 'hidden'}`}>
            {item.label}
          </span>
        </button>
      ))}
      <div
        ref={indicatorRef}
        className={`absolute bg-gradient-to-r from-pink-500 to-purple-500 ${
          isMobile ? 'rounded-t-md' : 'rounded-l-md'
        } transition-all duration-300`}
      />
    </div>
  );
}
