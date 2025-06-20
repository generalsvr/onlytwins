'use client';

import { useState } from 'react';
import { ArrowLeft, Copy, Share2, Users, ChevronRight, Sparkles, Crown, Gift, TrendingUp, Star, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AffiliateSectionProps {
  onBack: () => void;
}

export default function AffiliateSection({ onBack }: AffiliateSectionProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

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
      border: 'border-blue-500/20'
    },
    {
      label: 'Active Users',
      value: '8',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      label: 'Total Earnings',
      value: '1,250',
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
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
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-zinc-900/80 border-b border-zinc-800/50">
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
            <span className="text-sm font-medium text-pink-300">Earn While You Share</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Invite Friends & Earn Rewards
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Share your referral code and earn 200 tokens for each new user who signs up!
          </p>
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
                <h3 className="text-xl font-bold text-white">Your Referral Code</h3>
                <p className="text-white/80 text-sm">Share and earn 200 tokens per signup</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between mb-4 border border-white/20">
              <span className="font-mono font-bold text-2xl text-white tracking-wider">{referralCode}</span>
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

            <motion.button
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={18} />
              Share Referral Link
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`bg-zinc-900/50 backdrop-blur-xl rounded-xl p-6 border ${stat.border} hover:scale-105 transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4 border ${stat.border}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-zinc-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Earnings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-yellow-500/30">
              <Crown size={20} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Your Earnings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Available to Claim */}
            <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
              <p className="text-zinc-400 text-sm mb-2">Available to Claim</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🪙</span>
                  </div>
                  <span className="text-3xl font-bold text-white">750</span>
                  <span className="text-zinc-400">OTT</span>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Claim Now
                </motion.button>
              </div>
            </div>

            {/* Total Earned */}
            <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
              <p className="text-zinc-400 text-sm mb-2">Total Earned</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">💎</span>
                  </div>
                  <span className="text-3xl font-bold text-white">1,250</span>
                  <span className="text-zinc-400">OTT</span>
                </div>
                <button className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                  <span className="text-sm">History</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Earning Tiers */}
          <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-xl p-4 border border-zinc-700/30">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              Earning Tiers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                <div className="text-2xl mb-1">🥉</div>
                <p className="text-sm text-zinc-400">1-5 Referrals</p>
                <p className="text-white font-bold">200 OTT each</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                <div className="text-2xl mb-1">🥈</div>
                <p className="text-sm text-zinc-400">6-15 Referrals</p>
                <p className="text-white font-bold">250 OTT each</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                <div className="text-2xl mb-1">🥇</div>
                <p className="text-sm text-zinc-400">16+ Referrals</p>
                <p className="text-white font-bold">300 OTT each</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referrals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-blue-500" />
              Your Referrals
            </h3>
            <button className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {referrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                    <Users size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{referral.name}</p>
                    <p className="text-zinc-400 text-sm">Joined {referral.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <span className="text-lg">🪙</span>
                    <p className="font-semibold text-white">{referral.earnings}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${referral.status === 'active' ? 'bg-green-400' : 'bg-zinc-500'}`} />
                    <p className={`text-xs ${referral.status === 'active' ? 'text-green-400' : 'text-zinc-400'}`}>
                      {referral.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: Share2,
                title: 'Share Your Code',
                description: 'Send your unique referral code to friends and family',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10'
              },
              {
                step: '2',
                icon: Users,
                title: 'They Sign Up',
                description: 'Your friends create an account using your code',
                color: 'text-green-400',
                bg: 'bg-green-500/10'
              },
              {
                step: '3',
                icon: Gift,
                title: 'You Both Earn',
                description: 'You get tokens, they get a welcome bonus!',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-700/30`}>
                  <item.icon size={24} className={item.color} />
                </div>
                <h4 className="font-bold text-white mb-2">Step {item.step}: {item.title}</h4>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}