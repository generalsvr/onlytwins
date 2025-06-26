'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronLeft, CreditCard, Globe, Check, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import { useModalStore } from '@/lib/stores/modalStore';
import AuthModal from '@/components/auth/auth-modal';
import useWindowSize from '@/lib/hooks/useWindowSize';
import Image from 'next/image';
import PaymentPage from '@/components/payment-page';
import PaymentModal from '@/components/modals/payment';
import TokensModal from '@/components/modals/tokens';
import { useLocale } from '@/contexts/LanguageContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  onLogin?: () => void;
  onSignup?: () => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

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
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useWindowSize();
  const { openModal, closeModal } = useModalStore((state) => state);
  const { isAuthenticated, user } = useAuthStore();
  const { dictionary, locale } = useLocale();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleLanguageChange = (languageCode: string) => {
    setIsLanguageMenuOpen(false);

    // Get current path without locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Navigate to the same path with new locale
    const newPath = `/${languageCode}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
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
                aria-label={dictionary.header.goBack}
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
                    src="/favicon.png"
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
                  placeholder={dictionary.header.searchPlaceholder}
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
            {/* Language Switch */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-zinc-800/50 transition-all duration-200 group"
                aria-label="Change language"
              >
                <Globe
                  size={16}
                  className="text-zinc-400 group-hover:text-zinc-300"
                />
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">
                  {currentLanguage.flag}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-zinc-400 group-hover:text-zinc-300 transition-transform duration-200 ${
                    isLanguageMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-zinc-900/95 backdrop-blur-xl rounded-xl border border-zinc-700/50 shadow-2xl shadow-black/50 overflow-hidden z-200"
                  >
                    <div className="py-2">
                      {languages.map((language) => (
                        <motion.button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200
                            ${
                            locale === language.code
                              ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white'
                              : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                          }
                          `}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{language.flag}</span>
                            <div>
                              <div className="font-medium">
                                {language.nativeName}
                              </div>
                              <div className="text-xs text-zinc-400">
                                {language.name}
                              </div>
                            </div>
                          </div>
                          {locale === language.code && (
                            <Check size={16} className="text-pink-400" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button */}
            {showSearch && !isSearchActive && (
              <button
                onClick={activateSearch}
                className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
                aria-label={dictionary.header.search}
              >
                <Search size={20} className="text-zinc-300 hover:text-white" />
              </button>
            )}

            {/* Credits Display */}
            {isAuthenticated && (
              <div
                onClick={() =>
                  openModal({
                    type: 'message',
                    content: <TokensModal />,
                  })
                }
                className="flex items-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-full px-4 py-2 cursor-pointer hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-200"
              >
                <CreditCard size={16} className="text-pink-400 mr-2" />
                <span className="text-sm font-medium text-white">
                  {user?.balances.oTT || 0} {dictionary.header.tokens}
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
                  {dictionary.header.login}
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25"
                >
                  {dictionary.header.getStarted}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}