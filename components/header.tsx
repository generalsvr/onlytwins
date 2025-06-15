'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, Menu, X, CreditCard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from './safe-image';
import { useTheme } from '@/contexts/theme-context';
import { useAuthStore } from '@/lib/stores/authStore';
import { useModalStore } from '@/lib/stores/modalStore';
import AuthModal from '@/components/auth/auth-modal';
import useWindowSize from '@/lib/hooks/useWindowSize';
import NotificationsCenter from '@/components/notifications-center';
import Image from 'next/image';
import AudioRecorder from '@/components/ui/audio-recorder';
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  transparent?: boolean;
  hideOnMobile?: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
}

export default function Header({
  title,
  showBack = false,
  onLogin,
  onSignup,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const { theme } = useTheme();
  const { openModal, closeModal } = useModalStore((state) => state);
  const { isAuthenticated } = useAuthStore();

  const goBack = () => {
    router.back();
  };

  const activateSearch = () => {
    setIsSearchActive(true);
  };

  const deactivateSearch = () => {
    setIsSearchActive(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuth = (type: 'login' | 'signup') => {
    if (type === 'login' && onLogin) {
      onLogin();
    } else if (type === 'signup' && onSignup) {
      onSignup();
    }
    setIsMobileMenuOpen(false);
  };

  const isHomePage = pathname === '/';

  return (
    !isMobile && (
      <>
        <header
          className={` left-0 right-0 top-0 z-40 bg-black/90 backdrop-blur-md pb-1`}
        >

          <div className="flex items-center justify-between h-10">
            {/* Left section */}
            <div className="flex items-center">
              {showBack && (
                <button
                  onClick={goBack}
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  aria-label="Go back"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {!isSearchActive && (
                <>
                  {title ? (
                    <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
                  ) : (
                    <div className="h-10 flex items-center">
                      <Image
                        src="/ot-logo.png"
                        alt="OnlyTwins"
                        width={isMobile ? 100 : 120}
                        height={isMobile ? 28 : 40}
                        className="object-contain"
                      />
                    </div>
                  )}
                </>
              )}

              {isSearchActive && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  className="flex items-center bg-zinc-800 rounded-full px-3 py-1"
                >
                  <Search size={18} className="text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none ml-2 w-full"
                    autoFocus
                    onBlur={deactivateSearch}
                  />
                </motion.div>
              )}
            </div>

            {/* Right section - Desktop */}
            <div className="flex items-center space-x-6">
              {/*{showSearch && !isSearchActive && (*/}
              {/*  <button*/}
              {/*    onClick={activateSearch}*/}
              {/*    aria-label="Search"*/}
              {/*    className="hover:text-pink-500 transition-colors"*/}
              {/*  >*/}
              {/*    <Search*/}
              {/*      size={24}*/}
              {/*      className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}*/}
              {/*    />*/}
              {/*  </button>*/}
              {/*)}*/}

              {/*<div className="relative">*/}
              {/*  <NotificationsCenter />*/}
              {/*</div>*/}

              {/* Credit display for authenticated users */}
              {isAuthenticated && (
                <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1">
                  <CreditCard size={16} className="text-pink-400 mr-2" />
                  <span className="text-sm font-medium">100 credits</span>
                </div>
              )}

              {!isAuthenticated && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      openModal({
                        type: 'message',
                        content: (
                          <AuthModal
                            initialMode={'signup'}
                            onClose={() => closeModal()}
                          />
                        ),
                      });
                    }}
                    className="px-6 py-2 rounded-[8px] font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-colors"
                  >
                    Create your account
                  </button>
                  <button
                    onClick={() =>
                      openModal({
                        type: 'message',
                        content: (
                          <AuthModal
                            initialMode={'login'}
                            onClose={() => closeModal()}
                          />
                        ),
                      })
                    }
                    className="px-6 py-2 rounded-[8px] border border-zinc-700 hover:border-pink-500 transition-colors"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>

            {/* Right section - Mobile */}
            {/*<div className="flex md:hidden items-center space-x-4">*/}
            {/*  /!*{showSearch && !isSearchActive && (*!/*/}
            {/*  /!*  <button onClick={activateSearch} aria-label="Search">*!/*/}
            {/*  /!*    <Search*!/*/}
            {/*  /!*      size={22}*!/*/}
            {/*  /!*      className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}*!/*/}
            {/*  /!*    />*!/*/}
            {/*  /!*  </button>*!/*/}
            {/*  /!*)}*!/*/}

            {/*  /!* Credit display for authenticated users on mobile *!/*/}
            {/*  {isAuthenticated && (*/}
            {/*    <div className="flex items-center bg-zinc-800 rounded-full px-2 py-1">*/}
            {/*      <CreditCard size={14} className="text-pink-400 mr-1" />*/}
            {/*      <span className="text-xs font-medium">100</span>*/}
            {/*    </div>*/}
            {/*  )}*/}

            {/*  /!*{showNotifications && (*!/*/}
            {/*  /!*  <div className="relative">*!/*/}
            {/*  /!*    <NotificationsCenter />*!/*/}
            {/*  /!*  </div>*!/*/}
            {/*  /!*)}*!/*/}

            {/*  /!*<button*!/*/}
            {/*  /!*  onClick={toggleMobileMenu}*!/*/}
            {/*  /!*  aria-label="Menu"*!/*/}
            {/*  /!*  className="p-1"*!/*/}
            {/*  /!*>*!/*/}
            {/*  /!*  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}*!/*/}
            {/*  /!*</button>*!/*/}
            {/*</div>*/}
          </div>
        </header>

        {/* Mobile Menu - No login/signup options for Telegram Mini App */}
        {/*<AnimatePresence>*/}
        {/*  {isMobileMenuOpen && (*/}
        {/*    <motion.div*/}
        {/*      initial={{ opacity: 0, y: -20 }}*/}
        {/*      animate={{ opacity: 1, y: 0 }}*/}
        {/*      exit={{ opacity: 0, y: -20 }}*/}
        {/*      className="fixed inset-0 z-30 bg-black pt-16 px-6 flex items-start justify-center"*/}
        {/*    >*/}
        {/*      <div className="flex flex-col space-y-4 w-full max-w-xs mt-8">*/}
        {/*        /!* Only show Telegram info on mobile *!/*/}

        {/*          <div className="text-center text-zinc-400 py-4">*/}
        {/*            <p>OnlyTwins Telegram Mini App</p>*/}
        {/*            {isAuthenticated && (*/}
        {/*              <p className="mt-2">*/}
        {/*                You have{' '}*/}
        {/*                <span className="text-pink-400 font-bold">100</span>{' '}*/}
        {/*                credits*/}
        {/*              </p>*/}
        {/*            )}*/}
        {/*          </div>*/}

        {/*      </div>*/}
        {/*    </motion.div>*/}
        {/*  )}*/}
        {/*</AnimatePresence>*/}
      </>
    )
  );
}
