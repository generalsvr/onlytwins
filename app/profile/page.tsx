'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
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
import AudioRecorder from '@/components/ui/audio-recorder';
import useWindowSize from '@/lib/hooks/useWindowSize';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string>('main');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobile } = useWindowSize();
  // Sample stats
  const stats = [
    { label: 'Characters', value: '4' },
    { label: 'Chats', value: '12' },
    { label: 'Purchases', value: '3' },
    { label: 'Tokens', value: user?.tokens?.toString() || '0' },
  ];

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    setActiveSection('main');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  // Render the appropriate section based on activeSection state
  const renderSection = () => {
    console.log(activeSection);
    switch (activeSection) {
      case 'my-profile':
        return <MyProfileSection onBack={handleBack} />;
      case 'wallet':
        return <WalletSection onBack={handleBack} />;
      case 'affiliate':
        return <AffiliateSection onBack={handleBack} />;
      case 'subscription':
        return <SubscriptionSection onBack={handleBack} />;
      // case 'my-characters':
      //     return <MyCharactersSection onBack={handleBack} />;
      case 'notifications':
        return <NotificationsSection onBack={handleBack} />;
      case 'settings':
        return <SettingsSection onBack={handleBack} />;
      default:
        return renderMainSection();
    }
  };

  // Render the main profile section with menu items
  const renderMainSection = () => {
    return (
      <>
        {/* Header */}
        <div className=" from-pink-500 to-purple-600 md:rounded-xl">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
              {/*<SafeImage*/}
              {/*    src={user?.avatar || '/user-profile-illustration.png'}*/}
              {/*    alt="Profile"*/}
              {/*    width={80}*/}
              {/*    height={80}*/}
              {/*    className="object-cover"*/}
              {/*    fallbackSrc="/user-profile-illustration.png"*/}
              {/*/>*/}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{user?.firstName || 'FirstName'} {user?.lastName || 'lastName'}</h1>
              <p className="text-white/80">{user?.email || ''}</p>
              <div className="flex items-center mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    user?.isPremium ? 'bg-yellow-500 text-black' : 'bg-white/20'
                  }`}
                >
                  {user?.isPremium ? 'Premium' : 'Free Plan'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {/*<div className="grid grid-cols-4 gap-2 mt-6 bg-black/20 rounded-xl">*/}
          {/*  {stats.map((stat, index) => (*/}
          {/*    <div key={index} className="text-center">*/}
          {/*      <p className="text-lg font-bold">{stat.value}</p>*/}
          {/*      <p className="text-xs text-white/80">{stat.label}</p>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
        </div>

        {/* Menu Items */}
        <div className=" space-y-4 md:mt-6 pt-4">
          <div className="bg-zinc-900 rounded-xl overflow-hidden md:shadow-md md:hover:shadow-lg md:transition-shadow">
            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('my-profile')}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                <User size={20} className="text-pink-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">My Profile</h3>
                <p className="text-xs text-zinc-400">
                  Edit your personal information
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>

            <div className="h-px bg-zinc-800 mx-4" />

            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('wallet')}
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet size={20} className="text-purple-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">Wallet</h3>
                <p className="text-xs text-zinc-400">
                  Manage your tokens and payments
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>

            <div className="h-px bg-zinc-800 mx-4" />

            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('affiliate')}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users size={20} className="text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">Affiliate Program</h3>
                <p className="text-xs text-zinc-400">
                  Invite friends and earn rewards
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>
          </div>

          <div className="bg-zinc-900 rounded-xl overflow-hidden md:shadow-md md:hover:shadow-lg md:transition-shadow">
            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('subscription')}
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CreditCard size={20} className="text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">Subscription</h3>
                <p className="text-xs text-zinc-400">
                  Manage your subscription plan
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>

            <div className="h-px bg-zinc-800 mx-4" />

            {/*<motion.div*/}
            {/*    className="flex items-center p-4 cursor-pointer"*/}
            {/*    whileTap={{ scale: 0.98 }}*/}
            {/*    onClick={() => handleSectionChange('my-characters')}*/}
            {/*>*/}
            {/*    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">*/}
            {/*        <Gift size={20} className="text-yellow-500" />*/}
            {/*    </div>*/}
            {/*    <div className="ml-3 flex-1">*/}
            {/*        <h3 className="font-medium">My Characters</h3>*/}
            {/*        <p className="text-xs text-zinc-400">*/}
            {/*            Manage your AI companions*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*    <ChevronRight size={20} className="text-zinc-400" />*/}
            {/*</motion.div>*/}

            <div className="h-px bg-zinc-800 mx-4" />

            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('notifications')}
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Bell size={20} className="text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">Notifications</h3>
                <p className="text-xs text-zinc-400">
                  Manage your notification settings
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>
          </div>

          <div className="bg-zinc-900 rounded-xl overflow-hidden md:shadow-md md:hover:shadow-lg md:transition-shadow">
            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSectionChange('settings')}
            >
              <div className="w-10 h-10 rounded-full bg-zinc-700/20 flex items-center justify-center">
                <Settings size={20} className="text-zinc-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">Settings</h3>
                <p className="text-xs text-zinc-400">
                  App preferences and account settings
                </p>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </motion.div>

            <div className="h-px bg-zinc-800 mx-4" />

            <motion.div
              className="flex items-center p-4 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <LogOut size={20} className="text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium text-red-500">Logout</h3>
                <p className="text-xs text-zinc-400">
                  Sign out of your account
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`md:pb-0 md:flex md:min-h-screen ${isMobile && 'pt-6 px-4'}`}
    >
      <div className="md:w-full">{renderSection()}</div>
    </div>
  );
}
