'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Palette,
  Lock,
  FileText,
  MessageCircle,
  Star,
  Download,
  Trash2,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';

export default function SettingsPage() {
  const router = useRouter();
  const setLoading = useLoadingStore(state => state.setLoading);

  // Settings state
  const [settings, setSettings] = useState({
    darkMode: true,
    language: 'English',
    notifications: true,
    soundEffects: true,
    autoPlay: false,
    dataSaver: false,
    analytics: true,
    marketing: false,
  });

  // Stop loading when component mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleBack = () => {
    router.back();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const settingSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          id: 'theme',
          icon: settings.darkMode ? Moon : Sun,
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: settings.darkMode,
          onChange: (value: boolean) => updateSetting('darkMode', value),
        },
        {
          id: 'language',
          icon: Globe,
          title: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: settings.language,
          options: languages,
          onChange: (value: string) => updateSetting('language', value),
        },
      ],
    },
    {
      title: 'Notifications & Sounds',
      icon: Bell,
      items: [
        {
          id: 'notifications',
          icon: Bell,
          title: 'Push Notifications',
          description: 'Receive notifications about new messages',
          type: 'toggle',
          value: settings.notifications,
          onChange: (value: boolean) => updateSetting('notifications', value),
        },
        {
          id: 'sounds',
          icon: settings.soundEffects ? Volume2 : VolumeX,
          title: 'Sound Effects',
          description: 'Play sounds for interactions and notifications',
          type: 'toggle',
          value: settings.soundEffects,
          onChange: (value: boolean) => updateSetting('soundEffects', value),
        },
      ],
    },
    {
      title: 'Content & Media',
      icon: Monitor,
      items: [
        {
          id: 'autoplay',
          icon: settings.autoPlay ? Eye : EyeOff,
          title: 'Auto-play Media',
          description: 'Automatically play videos and animations',
          type: 'toggle',
          value: settings.autoPlay,
          onChange: (value: boolean) => updateSetting('autoPlay', value),
        },
        {
          id: 'datasaver',
          icon: Smartphone,
          title: 'Data Saver',
          description: 'Reduce data usage by compressing images',
          type: 'toggle',
          value: settings.dataSaver,
          onChange: (value: boolean) => updateSetting('dataSaver', value),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          id: 'privacy',
          icon: Shield,
          title: 'Privacy Settings',
          description: 'Manage your privacy preferences',
          type: 'navigation',
          action: () => ('Navigate to privacy settings'),
        },
        {
          id: 'security',
          icon: Lock,
          title: 'Account Security',
          description: 'Two-factor authentication and security',
          type: 'navigation',
          action: () => ('Navigate to security settings'),
        },
        {
          id: 'analytics',
          icon: SettingsIcon,
          title: 'Analytics',
          description: 'Help improve the app with usage data',
          type: 'toggle',
          value: settings.analytics,
          onChange: (value: boolean) => updateSetting('analytics', value),
        },
      ],
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        {
          id: 'faq',
          icon: HelpCircle,
          title: 'FAQ',
          description: 'Frequently asked questions',
          type: 'navigation',
          action: () => ('Navigate to FAQ'),
        },
        {
          id: 'support',
          icon: MessageCircle,
          title: 'Contact Support',
          description: '24/7 customer support',
          type: 'navigation',
          action: () => ('Navigate to support'),
        },
        {
          id: 'feedback',
          icon: Star,
          title: 'Send Feedback',
          description: 'Help us improve the app',
          type: 'navigation',
          action: () => ('Navigate to feedback'),
        },
      ],
    },
    {
      title: 'About',
      icon: Info,
      items: [
        {
          id: 'version',
          icon: Download,
          title: 'App Version',
          description: 'v1.2.3 (Latest)',
          type: 'info',
          value: '1.2.3',
        },
        {
          id: 'terms',
          icon: FileText,
          title: 'Terms of Service',
          description: 'Read our terms and conditions',
          type: 'navigation',
          action: () => ('Navigate to terms'),
        },
        {
          id: 'privacy-policy',
          icon: FileText,
          title: 'Privacy Policy',
          description: 'How we handle your data',
          type: 'navigation',
          action: () => ('Navigate to privacy policy'),
        },
      ],
    },
  ];

  const renderToggle = (value: boolean, onChange: (value: boolean) => void) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-12 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 shadow-lg"></div>
    </label>
  );

  const renderSelect = (value: string, options: any[], onChange: (value: string) => void) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2 text-white focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
    >
      {options.map((option) => (
        <option key={option.code} value={option.name} className="bg-zinc-800">
          {option.flag} {option.name}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800/50">
        <div className="flex items-center p-4">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
          >
            <ArrowLeft size={20} className="text-zinc-300" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-pink-500/30">
                  <section.icon size={20} className="text-pink-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
            </div>

            {/* Section Items */}
            <div className="divide-y divide-zinc-800/50">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  className={`p-4 hover:bg-zinc-800/30 transition-all duration-300 ${
                    item.type === 'navigation' ? 'cursor-pointer' : ''
                  }`}
                  onClick={item.type === 'navigation' ? item.action : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                        <item.icon size={18} className="text-zinc-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-zinc-400">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.type === 'toggle' && renderToggle(item.value, item.onChange)}
                      {item.type === 'select' && renderSelect(item.value, item.options, item.onChange)}
                      {item.type === 'info' && (
                        <div className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          <span className="text-sm text-zinc-300">{item.value}</span>
                        </div>
                      )}
                      {item.type === 'navigation' && (
                        <ChevronRight size={18} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: settingSections.length * 0.1 }}
          className="bg-red-500/5 backdrop-blur-xl rounded-2xl border border-red-500/20 overflow-hidden"
        >
          <div className="p-6 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Danger Zone</h2>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between p-4 hover:bg-red-500/10 transition-all duration-300 rounded-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Delete Account</h3>
                  <p className="text-sm text-zinc-400">Permanently delete your account and all data</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* App Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (settingSections.length + 1) * 0.1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/30 rounded-full border border-zinc-800/50">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">OT</span>
            </div>
            <span className="text-zinc-400 text-sm">OnlyTwins v1.2.3</span>
          </div>
          <p className="text-zinc-500 text-xs mt-2">
            Made with ❤️ for the best AI experience
          </p>
        </motion.div>
      </div>
    </div>
  );
}