'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  User,
  CreditCard,
  Crown,
  Coins,
  MessageCircle,
  ShoppingBag,
  Star,
  Edit3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LanguageContext';
import { billingService } from '@/lib/services/v1/client/billing';


export default function ProfilePage() {
  const { user, logout, getCurrentUser } = useAuthStore();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const { dictionary, locale } = useLocale();
  console.log(user)
  // Memoized stats to prevent unnecessary re-renders
  const stats = useMemo(
    () => [
      {
        label: dictionary.profile.characters,
        value: '4',
        icon: User,
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-500/10',
      },
      {
        label: dictionary.profile.chats,
        value: '12',
        icon: MessageCircle,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/10',
      },
      {
        label: dictionary.profile.purchases,
        value: '3',
        icon: ShoppingBag,
        color: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-500/10',
      },
      {
        label: dictionary.profile.tokens,
        value: user?.tokens?.toLocaleString() || '0',
        icon: Coins,
        color: 'from-yellow-500 to-orange-600',
        bgColor: 'bg-yellow-500/10',
      },
    ],
    [user?.tokens, dictionary.profile]
  );

  // Memoized menu items with routes
  const menuSections = useMemo(
    () => [
      {
        title: dictionary.profile.account,
        items: [
          {
            id: 'my-profile',
            route: '/profile/information',
            icon: User,
            title: dictionary.profile.myProfile,
            description: dictionary.profile.editPersonalInfo,
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
          },
          {
            id: 'wallet',
            route: '/profile/wallet',
            icon: Wallet,
            title: dictionary.profile.wallet,
            description: dictionary.profile.manageTokensPayments,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
          },
          {
            id: 'subscription',
            route: '/profile/subscription',
            icon: CreditCard,
            title: dictionary.profile.subscription,
            description: dictionary.profile.manageSubscriptionPlan,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            badge: user?.isPremium ? null : dictionary.profile.upgrade,
          },
        ],
      },
      {
        title: dictionary.profile.socialRewards,
        items: [
          {
            id: 'affiliate',
            route: '/profile/affiliate',
            icon: Users,
            title: dictionary.profile.affiliateProgram,
            description: dictionary.profile.inviteFriendsEarn,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
          },
        ],
      },
      {
        title: dictionary.profile.system,
        items: [
          {
            id: 'settings',
            route: '/profile/settings',
            icon: Settings,
            title: dictionary.profile.settings,
            description: dictionary.profile.appPreferences,
            color: 'text-zinc-400',
            bgColor: 'bg-zinc-500/10',
          },
        ],
      },
    ],
    [user?.isPremium, dictionary.profile]
  );

  const handleNavigation = (route: string) => {
    router.push(`/${locale}/${route}`);
    // Loading будет остановлен на новой странице
  };

  const handleLogout = async () => {
    if (!showLogoutConfirm) {
      setShowLogoutConfirm(true);
      return;
    }

    setLoading(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileEdit = () => {
    handleNavigation('/profile/information');
  };


  return (
    <div className={`min-h-screen ${isMobile ? 'pb-24' : 'pb-8'}`}>
      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-6 shadow-2xl shadow-pink-500/25">
            {/* Background decorations */}

            <div className="relative flex items-center">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <User size={40} className="text-white/80" />
                  </div>
                </div>
                {/*<button*/}
                {/*  onClick={handleProfileEdit}*/}
                {/*  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-200"*/}
                {/*>*/}
                {/*  <Edit3 size={14} className="text-white" />*/}
                {/*</button>*/}
              </div>

              {/* User Info */}
              <div className="ml-6 flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {user?.firstName || 'Firstname'} {user?.lastName || 'Lastname'}
                  </h1>
                  {user?.isPremium && (
                    <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-400/30">
                      <Crown size={16} className="text-yellow-400 mr-1" />
                      <span className="text-xs font-medium text-yellow-300">
                        {dictionary.profile.premium}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-white/80 mb-3">
                  {user?.email || 'user@example.com'}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center space-x-4">

                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <Coins size={14} className="text-yellow-400 mr-1" />
                    <span className="text-sm text-white font-medium">
                      {user?.balances.oTT?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}

          {/* Menu Sections */}
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-white mb-4 px-2">
                  {section.title}
                </h2>
                <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      <motion.button
                        className="w-full flex items-center p-4 cursor-pointer hover:bg-zinc-700/30 transition-all duration-200 group"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.route)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: sectionIndex * 0.1 + itemIndex * 0.05,
                        }}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                        >
                          <item.icon size={20} className={item.color} />
                        </div>
                        <div className="ml-4 flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-white group-hover:text-pink-300 transition-colors">
                              {item.title}
                            </h3>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight
                          size={20}
                          className="text-zinc-400 group-hover:text-pink-400 transition-colors"
                        />
                      </motion.button>
                      {itemIndex < section.items.length - 1 && (
                        <div className="h-px bg-zinc-700/50 mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Section */}
            <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
              <motion.button
                className="w-full flex items-center p-4 cursor-pointer hover:bg-red-500/10 transition-all duration-200 group"
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <LogOut size={20} className="text-red-500" />
                </div>
                <div className="ml-4 flex-1 text-left">
                  <h3 className="font-medium text-red-500 group-hover:text-red-400 transition-colors">
                    {showLogoutConfirm
                      ? dictionary.profile.confirmLogout
                      : dictionary.profile.logout}
                  </h3>
                  <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {showLogoutConfirm
                      ? dictionary.profile.tapToConfirm
                      : dictionary.profile.signOutAccount}
                  </p>
                </div>
                {showLogoutConfirm && (
                  <div className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}