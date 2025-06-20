'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, CreditCard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { useAuthStore } from '@/lib/stores/authStore';
import { useModalStore } from '@/lib/stores/modalStore';
import AuthModal from '@/components/auth/auth-modal';
import useWindowSize from '@/lib/hooks/useWindowSize';
import Image from 'next/image';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showSearch = false,
  onLogin,
  onSignup,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile } = useWindowSize();
  const { theme } = useTheme();
  const { openModal, closeModal } = useModalStore((state) => state);
  const { isAuthenticated, user } = useAuthStore();

  const goBack = () => {
    router.back();
  };

  const activateSearch = () => {
    setIsSearchActive(true);
  };

  const deactivateSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      deactivateSearch();
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    openModal({
      type: 'message',
      content: <AuthModal initialMode={mode} onClose={() => closeModal()} />,
    });

    if (mode === 'login' && onLogin) onLogin();
    if (mode === 'signup' && onSignup) onSignup();
  };

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-zinc-800/50">
      <div className="">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {showBack && (
              <button
                onClick={goBack}
                className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={20} className="text-zinc-300" />
              </button>
            )}

            {!isSearchActive ? (
              title ? (
                <h1 className="text-xl font-semibold text-white truncate max-w-xs">
                  {title}
                </h1>
              ) : (
                <div className="flex items-center">
                  <Image
                    src="/ot-logo.png"
                    alt="OnlyTwins"
                    width={120}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
              )
            ) : (
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-zinc-800/60 rounded-full px-4 py-2 min-w-[300px]"
              >
                <Search size={18} className="text-zinc-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search creators, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-zinc-400 flex-1"
                  autoFocus
                  onBlur={deactivateSearch}
                />
              </motion.form>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            {showSearch && !isSearchActive && (
              <button
                onClick={activateSearch}
                className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-zinc-300 hover:text-white" />
              </button>
            )}

            {/* Credits Display */}
            {isAuthenticated && (
              <div className="flex items-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full px-4 py-2">
                <CreditCard size={16} className="text-pink-400 mr-2" />
                <span className="text-sm font-medium text-white">
                  {user?.credits || 0} credits
                </span>
              </div>
            )}

            {/* Auth Buttons */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
