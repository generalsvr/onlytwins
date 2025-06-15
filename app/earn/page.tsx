'use client';

import { useState } from 'react';
import { Gift, Award, Calendar, ExternalLink, Coins } from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { useAuth } from '@/contexts/auth-context';
import useWindowSize from '@/lib/hooks/useWindowSize';

export default function EarnPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const { isMobile } = useWindowSize();
  // Sample tasks
  const tasks = [
    {
      id: 1,
      title: 'Daily Login',
      description: 'Log in to the app every day',
      reward: 10,
      progress: 1,
      total: 1,
      completed: true,
    },
    {
      id: 2,
      title: 'Chat with 3 Characters',
      description: 'Start conversations with different AI companions',
      reward: 25,
      progress: 3,
      total: 3,
      completed: false,
    },
    {
      id: 3,
      title: 'Share on Social Media',
      description: 'Share your favorite character on social media',
      reward: 50,
      progress: 0,
      total: 1,
      completed: false,
    },
    {
      id: 4,
      title: 'Create Your Own Character',
      description: 'Design and publish your own AI companion',
      reward: 100,
      progress: 0,
      total: 1,
      completed: false,
    },
  ];

  // Sample daily rewards
  const dailyRewards = [
    { day: 1, reward: 10, claimed: true },
    { day: 2, reward: 15, claimed: true },
    { day: 3, reward: 20, claimed: false },
    { day: 4, reward: 25, claimed: false },
    { day: 5, reward: 30, claimed: false },
    { day: 6, reward: 40, claimed: false },
    { day: 7, reward: 100, claimed: false },
  ];

  // Sample banner ads
  const bannerAds = [
    {
      id: 1,
      title: 'Premium Subscription',
      description:
        'Get 50 tokens for watching a video about our premium features',
      reward: 50,
      image: '/abstract-geometric-shapes.png',
    },
    {
      id: 2,
      title: 'New Character Release',
      description: 'Earn 30 tokens by checking out our newest AI companion',
      reward: 30,
      image: '/modern-art-gallery.png',
    },
  ];

  return (
    <div className={`md:pb-0 md:flex md:flex-col md:min-h-screen ${isMobile && 'pt-6 px-4'}`}>
      <div className="">
        {/* Header */}
        <div className="md:top-20 z-10 border-b border-zinc-800 md:rounded-t-xl">
          <h1 className="text-2xl font-bold mb-2">Earn Tokens</h1>

          {/* Token Balance */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-4 mb-4 md:p-6 md:flex md:items-center md:justify-between">
            <p className="text-sm text-white/80">Your Token Balance</p>
            <div className="flex items-center mt-1">
              <Coins size={20} className="mr-2" />
              <h2 className="text-2xl font-bold">{user?.tokens || 0} GPT</h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-800 md:mt-2 md:justify-center">
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === 'tasks'
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-zinc-400'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === 'daily'
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-zinc-400'
              }`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                activeTab === 'ads'
                  ? 'text-pink-500 border-b-2 border-pink-500'
                  : 'text-zinc-400'
              }`}
              onClick={() => setActiveTab('ads')}
            >
              Offers
            </button>
          </div>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {tasks.map((task) => (
              <div key={task.id} className="bg-zinc-900 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full">
                    <Coins size={14} className="text-yellow-400 mr-1" />
                    <span className="text-sm">{task.reward}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {task.progress}/{task.total}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${task.completed ? 'bg-green-500' : 'bg-pink-500'}`}
                      style={{
                        width: `${(task.progress / task.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <button
                  className={`w-full mt-3 py-2 rounded-lg text-sm font-medium ${
                    task.completed
                      ? 'bg-green-500 text-white'
                      : task.progress === task.total ? 'bg-green-500 text-white' :  'bg-zinc-800 text-zinc-300'
                  }`}
                  disabled={task.completed}
                >
                  {task.completed ? 'Claimed' : task.progress === task.total ? 'Claim' : 'Complete Task'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Daily Rewards Tab */}
        {activeTab === 'daily' && (
          <div className="p-4 md:grid md:grid-cols-1 md:gap-4">
            <div className="bg-zinc-900 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-pink-500" />
                <h3 className="font-semibold">Daily Login Streak</h3>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Log in every day to earn increasing rewards!
              </p>

              <div className="grid grid-cols-7 gap-2 mt-4">
                {dailyRewards.map((reward, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-2 rounded-lg ${
                      reward.claimed
                        ? 'bg-green-500/20 border border-green-500'
                        : index === 2 // Current day (day 3)
                          ? 'bg-pink-500/20 border border-pink-500'
                          : 'bg-zinc-800 border border-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      Day {reward.day}
                    </span>
                    <div className="flex items-center mt-1">
                      <Coins size={12} className="mr-1 text-yellow-400" />
                      <span className="text-xs">{reward.reward}</span>
                    </div>
                    {reward.claimed && (
                      <Award size={14} className="mt-1 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-4 py-3 rounded-lg font-medium bg-pink-500 text-white"
                disabled={dailyRewards[2].claimed}
              >
                Claim Day 3 Reward
              </button>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Weekly Bonus</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Complete all 7 days for a special bonus!
                  </p>
                </div>
                <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full">
                  <Gift size={14} className="text-pink-500 mr-1" />
                  <span className="text-sm">+100</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>Progress</span>
                  <span>2/7 days</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500"
                    style={{ width: '28.6%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ads/Offers Tab */}
        {activeTab === 'ads' && (
          <div className="p-4 space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {bannerAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-zinc-900 rounded-xl overflow-hidden"
              >
                <div className="relative h-32">
                  <SafeImage
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    fallbackSrc={`/placeholder.svg?height=128&width=400&query=${encodeURIComponent(ad.title)}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-3">
                    <h3 className="font-semibold">{ad.title}</h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-zinc-400">{ad.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center">
                      <Coins size={16} className="text-yellow-400 mr-1" />
                      <span>{ad.reward} tokens</span>
                    </div>
                    <button className="flex items-center bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">
                      View Offer <ExternalLink size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
