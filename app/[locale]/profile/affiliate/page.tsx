'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Share2,
  Users,
  ChevronRight,
  Sparkles,
  Crown,
  Gift,
  TrendingUp,
  Star,
  Check,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

interface AffiliateSectionProps {
  onBack: () => void;
}

export default function AffiliateSection({ onBack }: AffiliateSectionProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Sample referral code
  const referralCode = 'TWIN123';

  // Sample referral stats
  const stats = [
    {
      label: 'Total Referrals',
      value: '12',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Active Users',
      value: '8',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Total Earnings',
      value: '1,250',
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ];

  // Sample referral history
  const referrals = [
    {
      id: 1,
      name: 'John D.',
      date: '2023-05-15',
      status: 'active',
      earnings: 150,
    },
    {
      id: 2,
      name: 'Sarah M.',
      date: '2023-05-10',
      status: 'active',
      earnings: 200,
    },
    {
      id: 3,
      name: 'Alex K.',
      date: '2023-05-08',
      status: 'inactive',
      earnings: 50,
    },
    {
      id: 4,
      name: 'Emma R.',
      date: '2023-05-05',
      status: 'active',
      earnings: 300,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`mytwins_${user?.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
            >
              <ArrowLeft size={20} className="text-zinc-300" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Affiliate Program
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-pink-300">
              Earn While You Share
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Invite Friends & Earn Rewards
          </h2>
        </motion.div>

        {/* Referral Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-6 shadow-2xl shadow-purple-500/25"
        >
          {/* Background decorations */}
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Gift size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Your Referral Code
                </h3>
                <p className="text-white/80 text-sm">
                  Share and earn tokens
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between mb-4 border border-white/20">
              <span className="font-mono font-bold text-2xl text-white tracking-wider">
                mytwins_{user?.id}
              </span>
              <motion.button
                onClick={copyToClipboard}
                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <div className="flex items-center gap-2">
                    <Check size={18} />
                    <span className="text-sm font-medium">Copied!</span>
                  </div>
                ) : (
                  <Copy size={18} />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}