'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Wallet,
  Users,
  Settings,
  LayoutDashboard,
  Edit,
  Camera,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import SubscriptionPopup from './subscription-popup';
import SafeImage from '@/components/safe-image';

interface UserProfilePageProps {
  onBack: () => void;
}

export default function UserProfilePage({ onBack }: UserProfilePageProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const { theme, toggleTheme } = useTheme();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  // Navigation handler for the main sections
  const handleNavigate = (page: string) => {
    // For now, we'll just set the active section, but in the future
    // this could navigate to separate pages
    setActiveSection(page);

    // Dispatch a custom event for the main app to handle navigation
    // This is useful for sections that should be their own pages
    window.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
  };

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} ${
        theme === 'dark' ? 'text-white' : 'text-zinc-900'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-zinc-800">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6 border-b border-zinc-800">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <SafeImage
                src="/user-profile-illustration.png"
                alt="User Profile"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
              <Camera size={16} />
            </button>
          </div>

          <div className="ml-4">
            <h2 className="text-xl font-bold">Alex Johnson</h2>
            <p className="text-zinc-500">@alexj</p>
          </div>

          <button className="ml-auto bg-zinc-800 px-4 py-2 rounded-full flex items-center">
            <Edit size={16} className="mr-2" /> Edit
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <div className="text-center">
            <p className="font-bold">24</p>
            <p className="text-xs text-zinc-500">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold">1.2K</p>
            <p className="text-xs text-zinc-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold">348</p>
            <p className="text-xs text-zinc-500">Following</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Buttons */}
      <div className="grid grid-cols-4 gap-1 p-4 border-b border-zinc-800">
        <button
          onClick={() => handleNavigate('wallet')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeSection === 'wallet' ? 'bg-pink-500' : 'bg-zinc-800'
          }`}
        >
          <Wallet size={24} />
          <span className="text-xs mt-1">Wallet</span>
        </button>

        <button
          onClick={() => handleNavigate('affiliate')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeSection === 'affiliate' ? 'bg-pink-500' : 'bg-zinc-800'
          }`}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Affiliate</span>
        </button>

        <button
          onClick={() => handleNavigate('settings')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeSection === 'settings' ? 'bg-pink-500' : 'bg-zinc-800'
          }`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </button>

        <button
          onClick={() => handleNavigate('dashboard')}
          className={`flex flex-col items-center p-3 rounded-lg ${
            activeSection === 'dashboard' ? 'bg-pink-500' : 'bg-zinc-800'
          }`}
        >
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </button>
      </div>

      {/* Actionable Areas */}
      <div className="p-4 space-y-4">
        {/* Subscription Section */}
        <div className="bg-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Subscription</h3>
          <p className="text-zinc-400 mb-3">
            You are currently on the Free plan
          </p>
          <button
            onClick={() => setShowSubscriptionPopup(true)}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium"
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Wallet Top-up Section */}
        <div className="bg-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Wallet Balance</h3>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <SafeImage
                src="/coin-stack.png"
                alt="Credits"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="text-xl font-bold">850</span>
            </div>
            <button
              onClick={() => handleNavigate('wallet')}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg"
            >
              Top Up
            </button>
          </div>
        </div>

        {/* Language Section (deferred for now, but included as placeholder) */}
        <div className="bg-zinc-800 rounded-xl p-4 opacity-50">
          <h3 className="text-lg font-semibold mb-2">Language</h3>
          <p className="text-zinc-400">Coming soon</p>
        </div>
      </div>

      {/* Subscription Popup */}
      {showSubscriptionPopup && (
        <SubscriptionPopup onClose={() => setShowSubscriptionPopup(false)} />
      )}
    </div>
  );
}
