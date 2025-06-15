'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Gift,
  Users,
  Settings,
} from 'lucide-react';

interface NotificationsSectionProps {
  onBack: () => void;
}

export default function NotificationsSection({
  onBack,
}: NotificationsSectionProps) {
  // Sample notification preferences
  const [preferences, setPreferences] = useState({
    messages: true,
    likes: true,
    gifts: true,
    followers: true,
    updates: false,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-zinc-900 p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      {/* Notifications Content */}
      <div className="p-4">
        <div className="bg-zinc-900 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <MessageCircle size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-zinc-400 text-sm">
                    Notifications for new messages
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.messages}
                  onChange={() => handleToggle('messages')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <Heart size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="font-medium">Likes</p>
                  <p className="text-zinc-400 text-sm">
                    Notifications for likes on your content
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.likes}
                  onChange={() => handleToggle('likes')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                  <Gift size={20} className="text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">Gifts</p>
                  <p className="text-zinc-400 text-sm">
                    Notifications for gifts received
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.gifts}
                  onChange={() => handleToggle('gifts')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Users size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Followers</p>
                  <p className="text-zinc-400 text-sm">
                    Notifications for new followers
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.followers}
                  onChange={() => handleToggle('followers')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <Settings size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">App Updates</p>
                  <p className="text-zinc-400 text-sm">
                    Notifications for app updates and news
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.updates}
                  onChange={() => handleToggle('updates')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Email Notifications</h3>
          <p className="text-zinc-400 mb-4">
            Manage which emails you receive from OnlyTwins. You will always
            receive important account notifications.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <span>Marketing Emails</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
              <span>Weekly Digest</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.weeklyDigest}
                  onChange={() => handleToggle('weeklyDigest')}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
