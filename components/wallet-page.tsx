'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wallet, CreditCard, Clock, ChevronRight, Plus } from 'lucide-react';
import SubscriptionPopup from './subscription-popup';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  price: string;
  image: string;
}

interface Transaction {
  id: number;
  type: 'purchase' | 'spent';
  description: string;
  amount: string;
  date: string;
}

export default function WalletPage() {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const { isMobile } = useWindowSize();
  const creditPackages: CreditPackage[] = [
    {
      id: 1,
      name: 'Small',
      credits: 1000,
      price: '$9.99',
      image: '/coin-stack.png',
    },
    {
      id: 2,
      name: 'Medium',
      credits: 2500,
      price: '$19.99',
      image: '/coin-bag.png',
    },
    {
      id: 3,
      name: 'Large',
      credits: 5000,
      price: '$29.99',
      image: '/treasure-chest.png',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'purchase',
      description: 'Purchased 1000 Credits',
      amount: '+1000',
      date: 'May 5, 2023',
    },
    {
      id: 2,
      type: 'spent',
      description: 'Photo request to Claire',
      amount: '-50',
      date: 'May 4, 2023',
    },
    {
      id: 3,
      type: 'spent',
      description: 'Voice call with JennyPinky',
      amount: '-100',
      date: 'May 3, 2023',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className={"p-4"}>
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>

        {/* Credit Balance */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-white/80">Your Balance</p>
              <div className="flex items-center mt-1">
                <Image
                  src="/coin-stack.png"
                  alt="Credits"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <h2 className="text-3xl font-bold">850</h2>
              </div>
              <p className="text-sm text-white/80 mt-1">Credits</p>
            </div>
            <button
              className="bg-white text-pink-500 px-4 py-2 rounded-full font-medium text-sm"
              onClick={() => setShowSubscriptionPopup(true)}
            >
              <Plus size={16} className="inline-block mr-1" /> Add Credits
            </button>
          </div>
        </div>

        {/* Credit Packages */}
        <h2 className="text-xl font-bold mb-4">Credit Packages</h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-zinc-800 rounded-xl p-3 flex flex-col items-center"
              onClick={() => setShowSubscriptionPopup(true)}
            >
              <div className="w-12 h-12 relative mb-2">
                <Image
                  src={
                    pkg.image ||
                    `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(pkg.name + ' credits package')}`
                  }
                  alt={pkg.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-semibold text-sm">{pkg.credits}</p>
              <p className="text-xs text-zinc-400">{pkg.price}</p>
            </div>
          ))}
        </div>

        {/* Subscription */}
        <h2 className="text-xl font-bold mb-4">Subscription</h2>
        <div className="bg-zinc-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-semibold">Premium Plan</p>
                <p className="text-xs text-zinc-400">Renews on June 5, 2023</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-400" />
          </div>
        </div>

        {/* Transaction History */}
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="bg-zinc-800 rounded-xl overflow-hidden">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`p-4 flex items-center justify-between ${
                index < transactions.length - 1
                  ? 'border-b border-zinc-700'
                  : ''
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'purchase'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >
                  {transaction.type === 'purchase' ? (
                    <Plus size={20} />
                  ) : (
                    <Wallet size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-xs text-zinc-400 flex items-center">
                    <Clock size={12} className="mr-1" /> {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`font-semibold ${transaction.type === 'purchase' ? 'text-green-500' : 'text-red-500'}`}
              >
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showSubscriptionPopup && (
        <SubscriptionPopup onClose={() => setShowSubscriptionPopup(false)} />
      )}
    </div>
  );
}
