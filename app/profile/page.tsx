'use client';

import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  User,
  Bell,
  CreditCard,
  Gift,
  Crown,
  Coins,
  MessageCircle,
  ShoppingBag,
  Star,
  Edit3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '@/components/safe-image';
import { useAuth } from '@/contexts/auth-context';
import WalletSection from '@/components/profile/wallet-section';
import AffiliateSection from '@/components/profile/affiliate-section';
import SettingsSection from '@/components/profile/settings-section';
import MyCharactersSection from '@/components/profile/my-characters-section';
import NotificationsSection from '@/components/profile/notifications-section';
import MyProfileSection from '@/components/profile/my-profile-section';
import SubscriptionSection from '@/components/profile/subscription-section';
import { useAuthStore } from '@/lib/stores/authStore';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const setLoading = useLoadingStore(state => state.setLoading);
  const [activeSection, setActiveSection] = useState<string>('main');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobile } = useWindowSize();
  const router = useRouter();

  // Memoized stats to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      label: 'Characters',
      value: '4',
      icon: User,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Chats',
      value: '12',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Purchases',
      value: '3',
      icon: ShoppingBag,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Tokens',
      value: user?.tokens?.toLocaleString() || '0',
      icon: Coins,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10'
    },
  ], [user?.tokens]);

  // Memoized menu items
  const menuSections = useMemo(() => [
    {
      title: 'Account',
      items: [
        {
          id: 'my-profile',
          icon: User,
          title: 'My Profile',
          description: 'Edit your personal information',
          color: 'text-pink-500',
          bgColor: 'bg-pink-500/10',
        },
        {
          id: 'wallet',
          icon: Wallet,
          title: 'Wallet',
          description: 'Manage your tokens and payments',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
        },
        {
          id: 'subscription',
          icon: CreditCard,
          title: 'Subscription',
          description: 'Manage your subscription plan',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          badge: user?.isPremium ? null : 'Upgrade',
        },
      ]
    },
    {
      title: 'Social & Rewards',
      items: [
        {
          id: 'affiliate',
          icon: Users,
          title: 'Affiliate Program',
          description: 'Invite friends and earn rewards',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        },
        {
          id: 'notifications',
          icon: Bell,
          title: 'Notifications',
          description: 'Manage your notification settings',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          badge: '3',
        },
      ]
    },
    {
      title: 'System',
      items: [
        {
          id: 'settings',
          icon: Settings,
          title: 'Settings',
          description: 'App preferences and account settings',
          color: 'text-zinc-400',
          bgColor: 'bg-zinc-500/10',
        },
      ]
    }
  ], [user?.isPremium]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection('main');
  };

  const handleLogout = async () => {
    console.log(showLogoutConfirm)
    if (!showLogoutConfirm) {
      setShowLogoutConfirm(true);
      return;
    }

    setLoading(true);
    await logout().then(() => {
      router.push('/');
      setLoading(false);
    });
  };

  // Render the appropriate section
  const renderSection = () => {
    switch (activeSection) {
      case 'my-profile':
        return <MyProfileSection onBack={handleBack} />;
      case 'wallet':
        return <WalletSection onBack={handleBack} />;
      case 'affiliate':
        return <AffiliateSection onBack={handleBack} />;
      case 'subscription':
        return <SubscriptionSection onBack={handleBack} />;
      case 'notifications':
        return <NotificationsSection onBack={handleBack} />;
      case 'settings':
        return <SettingsSection onBack={handleBack} />;
      default:
        return renderMainSection();
    }
  };

  const renderMainSection = () => {
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-6 shadow-2xl shadow-pink-500/25">
          {/* Background decorations */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />

          <div className="relative flex items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <User size={40} className="text-white/80" />
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Edit3 size={14} className="text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="ml-6 flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {user?.firstName || 'First'} {user?.lastName || 'Last'}
                </h1>
                {user?.isPremium && (
                  <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-400/30">
                    <Crown size={16} className="text-yellow-400 mr-1" />
                    <span className="text-xs font-medium text-yellow-300">Premium</span>
                  </div>
                )}
              </div>
              <p className="text-white/80 mb-3">{user?.email || 'user@example.com'}</p>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-400 mr-1" />
                  <span className="text-sm text-white font-medium">4.9 Rating</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <Coins size={14} className="text-yellow-400 mr-1" />
                  <span className="text-sm text-white font-medium">{user?.tokens?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/*<div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
        {/*  {stats.map((stat, index) => (*/}
        {/*    <motion.div*/}
        {/*      key={stat.label}*/}
        {/*      initial={{ opacity: 0, y: 20 }}*/}
        {/*      animate={{ opacity: 1, y: 0 }}*/}
        {/*      transition={{ delay: index * 0.1 }}*/}
        {/*      className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-4 border border-zinc-700/30 hover:bg-zinc-800/60 transition-all duration-200"*/}
        {/*    >*/}
        {/*      <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>*/}
        {/*        <stat.icon size={20} className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />*/}
        {/*      </div>*/}
        {/*      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>*/}
        {/*      <p className="text-sm text-zinc-400">{stat.label}</p>*/}
        {/*    </motion.div>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* Menu Sections */}
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-white mb-4 px-2">{section.title}</h2>
              <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id}>
                    <motion.div
                      className="flex items-center p-4 cursor-pointer hover:bg-zinc-700/30 transition-all duration-200 group"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSectionChange(item.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon size={20} className={item.color} />
                      </div>
                      <div className="ml-4 flex-1">
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
                      <ChevronRight size={20} className="text-zinc-400 group-hover:text-pink-400 transition-colors" />
                    </motion.div>
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
            <motion.div
              className="flex items-center p-4 cursor-pointer hover:bg-red-500/10 transition-all duration-200 group"
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <LogOut size={20} className="text-red-500" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-red-500 group-hover:text-red-400 transition-colors">
                  {showLogoutConfirm ? 'Confirm Logout' : 'Logout'}
                </h3>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {showLogoutConfirm ? 'Tap again to confirm' : 'Sign out of your account'}
                </p>
              </div>
              {showLogoutConfirm && (
                <div className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isMobile ? 'pb-24' : 'pb-8'}`}>
      {/* Header with backdrop blur for sub-sections */}
      {activeSection !== 'main' && (
        <div className="sticky top-0 z-50">
          <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-transparent pointer-events-none" />
          <div className="relative p-4 bg-zinc-900/30 backdrop-blur-xl border-b border-zinc-700/30">
            <button
              onClick={handleBack}
              className="flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} className="rotate-180 mr-2" />
              Back to Profile
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>


    </div>
  );
}