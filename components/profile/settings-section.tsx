'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface SettingsSectionProps {
  onBack: () => void;
}

export default function SettingsSection({ onBack }: SettingsSectionProps) {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-zinc-900 p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Settings Content */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Appearance */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                {darkMode ? (
                  <Moon size={20} className="mr-3" />
                ) : (
                  <Sun size={20} className="mr-3" />
                )}
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Language</h3>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <Globe size={20} className="mr-3" />
                <span>Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-700 border-none rounded-lg px-3 py-1"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Notifications</h3>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <Bell size={20} className="mr-3" />
                <span>Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Privacy & Security</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center">
                  <Shield size={20} className="mr-3" />
                  <span>Privacy Settings</span>
                </div>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center">
                  <Shield size={20} className="mr-3" />
                  <span>Account Security</span>
                </div>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">Help & Support</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center">
                  <HelpCircle size={20} className="mr-3" />
                  <span>FAQ</span>
                </div>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center">
                  <HelpCircle size={20} className="mr-3" />
                  <span>Contact Support</span>
                </div>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-zinc-900 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span>Version</span>
                <span className="text-zinc-400">1.0.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span>Terms of Service</span>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <span>Privacy Policy</span>
                <ArrowLeft size={20} className="rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
