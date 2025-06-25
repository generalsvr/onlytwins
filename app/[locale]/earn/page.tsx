'use client';

import { useState, useMemo } from 'react';
import { Gift, Calendar, ExternalLink, Coins, Trophy, Zap, CheckCircle, Clock } from 'lucide-react';
import SafeImage from '@/components/safe-image';

import useWindowSize from '@/lib/hooks/useWindowSize';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/authStore';

export default function EarnPage() {
  const { user } = useAuthStore(state => state);
  const [activeTab, setActiveTab] = useState('tasks');
  const [claimedTasks, setClaimedTasks] = useState<Set<number>>(new Set());
  const [claimedDays, setClaimedDays] = useState<Set<number>>(new Set([1, 2]));
  const { isMobile } = useWindowSize();

  // Memoized data to prevent unnecessary re-renders
  const tasks = useMemo(() => [
    {
      id: 1,
      title: 'Daily Login',
      description: 'Log in to the app every day',
      reward: 10,
      progress: 1,
      total: 1,
      completed: true,
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 2,
      title: 'Chat with 3 Characters',
      description: 'Start conversations with different AI companions',
      reward: 25,
      progress: 2,
      total: 3,
      completed: false,
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 3,
      title: 'Share on Social Media',
      description: 'Share your favorite character on social media',
      reward: 50,
      progress: 0,
      total: 1,
      completed: false,
      icon: ExternalLink,
      color: 'from-purple-500 to-violet-600',
    },
    {
      id: 4,
      title: 'Create Your Own Character',
      description: 'Design and publish your own AI companion',
      reward: 100,
      progress: 0,
      total: 1,
      completed: false,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-600',
    },
  ], []);

  const dailyRewards = useMemo(() => [
    { day: 1, reward: 10, claimed: true },
    { day: 2, reward: 15, claimed: true },
    { day: 3, reward: 20, claimed: false, current: true },
    { day: 4, reward: 25, claimed: false },
    { day: 5, reward: 30, claimed: false },
    { day: 6, reward: 40, claimed: false },
    { day: 7, reward: 100, claimed: false, special: true },
  ], []);

  const bannerAds = useMemo(() => [
    {
      id: 1,
      title: 'Premium Subscription',
      description: 'Get 50 tokens for watching a video about our premium features',
      reward: 50,
      image: '/abstract-geometric-shapes.png',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      id: 2,
      title: 'New Character Release',
      description: 'Earn 30 tokens by checking out our newest AI companion',
      reward: 30,
      image: '/modern-art-gallery.png',
      gradient: 'from-purple-500 to-indigo-600',
    },
  ], []);

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'daily', label: 'Daily', icon: Calendar },
    { id: 'ads', label: 'Offers', icon: Gift },
  ];

  const handleClaimTask = (taskId: number) => {
    setClaimedTasks(prev => new Set([...prev, taskId]));
  };

  const handleClaimDaily = (day: number) => {
    setClaimedDays(prev => new Set([...prev, day]));
  };

  const totalTokens = user?.tokens || 0;
  const completedTasksCount = tasks.filter(t => t.completed || claimedTasks.has(t.id)).length;
  const currentStreak = claimedDays.size;

  return (
    <div className={`min-h-screen ${isMobile ? 'pb-24' : 'pb-8'}`}>
      {/* Header with backdrop blur */}
      <div className="sticky top-0 z-50">

        <div className="relative p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-6`}>
              Earn Tokens
            </h1>

            {/* Token Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-6 mb-6 shadow-2xl shadow-pink-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">Your Token Balance</p>
                  <div className="flex items-center">
                    <Coins size={24} className="mr-3 text-yellow-300" />
                    <h2 className="text-3xl font-bold text-white">{totalTokens.toLocaleString()}</h2>
                    <span className="ml-2 text-white/80 text-lg">GPT</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/80 text-xs">Tasks Completed</div>
                  <div className="text-2xl font-bold text-white">{completedTasksCount}/{tasks.length}</div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            </div>

            {/* Tabs */}
            <div className="flex bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-1 border border-zinc-700/30">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`
                    flex-1 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-200
                    ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                  }
                  `}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} className="mr-2" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              {tasks.map((task, index) => {
                const isCompleted = task.completed || claimedTasks.has(task.id);
                const canClaim = task.progress >= task.total && !isCompleted;
                const progressPercent = (task.progress / task.total) * 100;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative overflow-hidden rounded-2xl p-6 transition-all duration-200
                      bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/30
                      hover:bg-zinc-800/60 hover:border-zinc-600/50 hover:shadow-lg
                      ${canClaim ? 'ring-2 ring-green-500/50 shadow-lg shadow-green-500/10' : ''}
                    `}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${task.color} opacity-5`} />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4 min-h-[100px]">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${task.color} shadow-lg mr-4`}>
                            <task.icon size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{task.title}</h3>
                            <p className="text-zinc-400 text-sm mt-1">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-zinc-700/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-zinc-600/30">
                          <Coins size={16} className="text-yellow-400 mr-2" />
                          <span className="font-semibold text-white">{task.reward}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-zinc-400 mb-2">
                          <span>Progress</span>
                          <span>{task.progress}/{task.total}</span>
                        </div>
                        <div className="h-3 bg-zinc-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                canClaim ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                  'bg-gradient-to-r from-pink-500 to-purple-600'
                            }`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className={`
                          w-full py-3 rounded-xl font-medium transition-all duration-200
                          ${isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                          : canClaim
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                            : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600/50 border border-zinc-600/30'
                        }
                        `}
                        onClick={() => canClaim && handleClaimTask(task.id)}
                        disabled={isCompleted}
                      >
                        {isCompleted ? (
                          <div className="flex items-center justify-center">
                            <CheckCircle size={18} className="mr-2" />
                            Claimed
                          </div>
                        ) : canClaim ? (
                          'Claim Reward'
                        ) : (
                          'Complete Task'
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Daily Rewards Tab */}
          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Daily Streak Card */}
              <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/30">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg mr-4">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xl">Daily Login Streak</h3>
                    <p className="text-zinc-400">Current streak: {currentStreak} days</p>
                  </div>
                </div>

                {/* Daily Rewards Grid */}
                <div className="grid grid-cols-7 gap-3 mb-6">
                  {dailyRewards.map((reward, index) => {
                    const isClaimed = claimedDays.has(reward.day);
                    const isCurrent = reward.current && !isClaimed;

                    return (
                      <div
                        key={reward.day}
                        className={`
                          relative flex flex-col items-center p-3 rounded-xl transition-all duration-200
                          ${isClaimed
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30'
                          : isCurrent
                            ? 'bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/50 shadow-lg shadow-pink-500/10'
                            : 'bg-zinc-700/30 border border-zinc-600/30 hover:bg-zinc-600/30'
                        }
                        `}
                      >
                        {reward.special && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                            <Trophy size={12} className="text-white" />
                          </div>
                        )}

                        <span className="text-xs font-medium text-zinc-300 mb-2">
                          Day {reward.day}
                        </span>
                        <div className="flex items-center mb-2">
                          <Coins size={14} className="mr-1 text-yellow-400" />
                          <span className="text-sm font-semibold text-white">{reward.reward}</span>
                        </div>
                        {isClaimed && (
                          <CheckCircle size={16} className="text-green-400" />
                        )}
                        {isCurrent && (
                          <Clock size={16} className="text-pink-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Claim Button */}
                <button
                  className="w-full py-4 rounded-xl font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg shadow-pink-500/25"
                  onClick={() => handleClaimDaily(3)}
                  disabled={claimedDays.has(3)}
                >
                  {claimedDays.has(3) ? 'Already Claimed Today' : 'Claim Day 3 Reward (20 tokens)'}
                </button>
              </div>

              {/* Weekly Bonus Card */}
              <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg mr-4">
                      <Gift size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-xl">Weekly Bonus</h3>
                      <p className="text-zinc-400">Complete all 7 days for a special bonus!</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-zinc-700/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-zinc-600/30">
                    <Gift size={18} className="text-yellow-400 mr-2" />
                    <span className="font-semibold text-white">+100</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-zinc-400 mb-2">
                    <span>Weekly Progress</span>
                    <span>{currentStreak}/7 days</span>
                  </div>
                  <div className="h-3 bg-zinc-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 transition-all duration-500"
                      style={{ width: `${(currentStreak / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Offers Tab */}
          {activeTab === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}
            >
              {bannerAds.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200"
                >
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <SafeImage
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc={`/placeholder.svg?height=192&width=400&query=${encodeURIComponent(ad.title)}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${ad.gradient} opacity-20`} />

                    {/* Reward Badge */}
                    <div className="absolute top-4 right-4 flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
                      <Coins size={16} className="text-yellow-400 mr-2" />
                      <span className="font-semibold text-white">{ad.reward}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-white text-xl mb-2">{ad.title}</h3>
                    <p className="text-zinc-400 mb-4">{ad.description}</p>

                    <button className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg shadow-pink-500/25">
                      View Offer
                      <ExternalLink size={18} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}