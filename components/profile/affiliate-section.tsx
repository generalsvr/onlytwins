'use client';

import { useState } from 'react';
import { ArrowLeft, Copy, Share2, Users, ChevronRight } from 'lucide-react';

interface AffiliateSectionProps {
  onBack: () => void;
}

export default function AffiliateSection({ onBack }: AffiliateSectionProps) {
  const [copied, setCopied] = useState(false);

  // Sample referral code
  const referralCode = 'TWIN123';

  // Sample referral stats
  const stats = [
    { label: 'Total Referrals', value: '12' },
    { label: 'Active Users', value: '8' },
    { label: 'Earnings', value: '1,250' },
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

  return (
    <div>
      {/* Header */}
      <div className="p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Affiliate Program</h1>
      </div>

      {/* Affiliate Content */}
      <div className="p-4">
        {/* Referral Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Invite Friends & Earn</h2>
          <p className="text-white/80 mb-4">
            Share your referral code and earn 200 tokens for each new user who
            signs up!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between mb-4">
            <span className="font-mono font-bold text-lg">{referralCode}</span>
            <button
              onClick={copyToClipboard}
              className="bg-white text-purple-600 p-2 rounded-lg"
            >
              {copied ? 'Copied!' : <Copy size={18} />}
            </button>
          </div>

          <button className="bg-white text-purple-600 w-full py-3 rounded-lg font-semibold flex items-center justify-center">
            <Share2 size={18} className="mr-2" />
            Share Referral Link
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-zinc-900 rounded-xl p-4 text-center">
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-zinc-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Earnings */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Your Earnings</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zinc-400 text-sm">Available to Claim</p>
              <div className="flex items-center">
                {/*<SafeImage*/}
                {/*  src="/coin-stack.png"*/}
                {/*  alt="Tokens"*/}
                {/*  width={24}*/}
                {/*  height={24}*/}
                {/*  className="mr-2"*/}
                {/*/>*/}
                <p className="text-2xl font-bold">750</p>
              </div>
            </div>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium">
              Claim Now
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total Earned</p>
              <div className="flex items-center">
                {/*<SafeImage*/}
                {/*  src="/coin-stack.png"*/}
                {/*  alt="Tokens"*/}
                {/*  width={24}*/}
                {/*  height={24}*/}
                {/*  className="mr-2"*/}
                {/*/>*/}
                <p className="text-xl font-bold">1,250</p>
              </div>
            </div>
            <button className="text-zinc-400 flex items-center">
              History <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Referrals */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">Your Referrals</h3>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center mr-3">
                    <Users size={18} className="text-zinc-300" />
                  </div>
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-zinc-400 text-sm">{referral.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    {/*<SafeImage*/}
                    {/*  src="/coin-stack.png"*/}
                    {/*  alt="Tokens"*/}
                    {/*  width={16}*/}
                    {/*  height={16}*/}
                    {/*  className="mr-1"*/}
                    {/*/>*/}
                    <p className="font-semibold">{referral.earnings}</p>
                  </div>
                  <p
                    className={`text-xs ${referral.status === 'active' ? 'text-green-500' : 'text-zinc-400'}`}
                  >
                    {referral.status === 'active' ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
