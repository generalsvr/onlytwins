'use client';

import React, {
  useRef,
  useEffect,
  JSX,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import {
  Home,
  Search,
  MessageCircle,
  DollarSign,
  User,
  LucideProps,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import useWindowSize from '@/lib/hooks/useWindowSize';
import AuthModal from '@/components/auth/auth-modal';
import { useModalStore } from '@/lib/stores/modalStore';

interface NavItem {
  id: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
  isAuth?: boolean;
  badge?: number;
}

export default function MainNavigation() {
  const { isAuthenticated } = useAuthStore();
  const { isMobile } = useWindowSize();
  const { closeModal, openModal } = useModalStore((state) => state);

  const navItems: NavItem[] = [
    { id: 'feed', icon: Home, label: 'Feed', path: '/' },
    {
      id: 'chats',
      icon: MessageCircle,
      label: 'Chat',
      path: '/chats',
      isAuth: true,
      badge: 0, // Mock unread count
    },
    {
      id: 'earn',
      icon: DollarSign,
      label: 'Earn',
      path: '/earn',
      isAuth: true,
    },
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      path: '/profile',
      isAuth: true,
    },
  ];

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
        const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = activeButton;

        if (isMobile) {
          // Mobile: horizontal indicator
          indicatorRef.current.style.width = `${offsetWidth - 16}px`;
          indicatorRef.current.style.height = '3px';
          indicatorRef.current.style.left = `${offsetLeft + 8}px`;
          indicatorRef.current.style.top = '4px';
        } else {
          // Desktop: vertical indicator
          indicatorRef.current.style.width = '4px';
          indicatorRef.current.style.height = `${offsetHeight - 16}px`;
          indicatorRef.current.style.left = '8px';
          indicatorRef.current.style.top = `${offsetTop + 8}px`;
        }
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activePage, isMobile]);

  const handleNavigate = (item: NavItem) => {
    if (!isAuthenticated && item.isAuth) {
      openModal({
        type: 'message',
        content: <AuthModal initialMode="login" onClose={() => closeModal()} />,
      });
      return;
    }

    router.push(item.path);
  };

  const isActive = (item: NavItem) => {
    return activePage === item.id || (item.id === 'chats' && pathname.includes('chat/'));
  };

  return (
    <nav
      ref={navRef}
      className={`
          ${isMobile ? 'fixed left-0 right-0 bottom-0' : 'absolute-center-right'}  z-50 bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/30 shadow-2xl
          ${isMobile
        ? 'h-16 rounded-2xl flex justify-around items-center'
        : 'top-1/2 right-6 transform -translate-y-1/2 w-20 rounded-2xl flex flex-col justify-center items-center py-4'
      }
        `}
    >
      {/* Active indicator */}
      <div
        ref={indicatorRef}
        className={`
            absolute bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25
            ${isMobile ? 'rounded-full' : 'rounded-full'}
            transition-all duration-300 ease-out
          `}
      />

      {navItems.map((item, index) => {
        const active = isActive(item);
        const disabled = item.isAuth && !isAuthenticated;

        return (
          <motion.button
            key={item.id}
            data-id={item.id}
            data-active={item.id === 'chats' && pathname.includes('chat/') ? 'true' : 'false'}
            className={`
                relative flex items-center justify-center transition-all duration-200
                ${isMobile ? 'flex-col flex-1 h-full px-2' : 'w-full h-16 my-1'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}
                group
              `}
            onClick={() => !disabled && handleNavigate(item)}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            initial={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            aria-label={item.label}
          >
            {/* Icon container */}
            <div className="relative">
              <div className={`
                  p-2 rounded-xl transition-all duration-200
                  ${active
                ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 shadow-lg'
                : 'group-hover:bg-zinc-700/50'
              }
                `}>
                <item.icon size={isMobile ? 22 : 24} />
              </div>

              {/* Badge for notifications */}
              <AnimatePresence>
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                      <span className="text-xs font-bold text-white">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glow effect for active item */}
              {active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-xl -z-10" />
              )}
            </div>

            {/* Label */}
            <span className={`
                text-xs font-medium transition-all duration-200
                ${isMobile ? 'mt-1' : 'hidden'}
                ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}
              `}>
                {item.label}
              </span>

            {/* Tooltip for desktop */}
            {!isMobile && (
              <div className="absolute right-full mr-4 px-3 py-2 bg-zinc-900/95 backdrop-blur-sm text-white text-sm rounded-lg shadow-lg border border-zinc-700/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.label}
                {disabled && (
                  <div className="text-xs text-zinc-400 mt-1">
                    Login required
                  </div>
                )}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-zinc-900" />
              </div>
            )}

            {/* Lock icon for auth-required items */}
            {disabled && (
              <div className="absolute top-1 right-1 w-3 h-3 bg-zinc-600 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
              </div>
            )}
          </motion.button>
        );
      })}

      {/* Bottom glow effect */}
      <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/5 to-purple-500/5 pointer-events-none
          ${isMobile ? '' : ''}
        `} />
    </nav>

  // {/* Mobile safe area */}
  // {isMobile && <div className="h-4" />}

  );
}