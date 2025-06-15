'use client';

import { useState } from 'react';
import {ArrowLeft, Banknote, Coins, Plus} from 'lucide-react';
import SafeImage from '../safe-image';
import StripeCheckoutButton from '@/components/stripe-buttons';
import WalletConnect from '@/components/payments/wallet-connect';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface WalletSectionProps {
  onBack: () => void;
}
interface TokenPackage {
  id: number;
  bonus: string;
  effectiveTokens: number;
  price: number;
  baseTokens: number;
  costPerToken: number;
  image: string;
  popular?: boolean;
}
export default function WalletSection({ onBack }: WalletSectionProps) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(
    null
  );
  const { isMobile } = useWindowSize();

  // Sample transaction history
  const transactions = [
    {
      id: 1,
      type: 'purchase',
      description: 'Premium Content',
      amount: -250,
      date: '2023-05-15',
    },
    {
      id: 2,
      type: 'topup',
      description: 'Token Purchase',
      amount: 1000,
      date: '2023-05-10',
    },
    {
      id: 3,
      type: 'reward',
      description: 'Daily Reward',
      amount: 50,
      date: '2023-05-08',
    },
    {
      id: 4,
      type: 'purchase',
      description: 'Voice Call',
      amount: -100,
      date: '2023-05-05',
    },
    {
      id: 5,
      type: 'affiliate',
      description: 'Referral Bonus',
      amount: 200,
      date: '2023-05-01',
    },
  ];

  // Updated token packages based on the screenshot
  const tokenPackages: TokenPackage[] = [
    {
      id: 1,
      bonus: 'None',
      effectiveTokens: 100,
      price: 9.99,
      baseTokens: 100,
      costPerToken: 0.0999,
      image: '/coin-stack.svg',
    },
    {
      id: 2,
      bonus: 'None',
      effectiveTokens: 350,
      price: 34.99,
      baseTokens: 350,
      costPerToken: 0.0999,
      image: '/coin-stack.svg',
    },
    {
      id: 3,
      bonus: '+10% bonus',
      effectiveTokens: 550,
      price: 49.99,
      baseTokens: 500,
      costPerToken: 0.0909,
      image: '/coin-pot.png',
    },
    {
      id: 4,
      bonus: '+15% bonus',
      effectiveTokens: 1150,
      price: 99.99,
      baseTokens: 1000,
      costPerToken: 0.0869,
      image: '/treasure-chest.png',
      popular: true,
    },
    {
      id: 5,
      bonus: '+20% bonus',
      effectiveTokens: 2400,
      price: 199.99,
      baseTokens: 2000,
      costPerToken: 0.0833,
      image: '/golden-victory-cup.png',
    },
    {
      id: 6,
      bonus: '+25% bonus',
      effectiveTokens: 3750,
      price: 299.99,
      baseTokens: 3000,
      costPerToken: 0.0799,
      image: '/golden-victory-cup.png',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="pb-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Wallet</h1>
      </div>

      {/* Wallet Content */}
      <div className={isMobile ? '' : 'pt-2'}>
        {!showTopUp ? (
          <>
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6 mb-6">
              <p className="text-white/80 mb-1">Current Balance</p>
              <div className="flex items-center mb-4">
                <Banknote size={36} />
                <h2 className="text-3xl font-bold pl-3">850</h2>
              </div>
              <button
                onClick={() => setShowTopUp(true)}
                className="bg-white text-purple-600 w-full py-3 rounded-lg font-semibold flex items-center justify-center"
              >
                <Plus size={18} className="mr-2" />
                Top Up Tokens
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-zinc-900 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-3">
                <WalletConnect isCanPay={false} />
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-zinc-900 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">
                Transaction History
              </h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          transaction.amount > 0
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <Plus size={18} className="text-green-500" />
                        ) : (
                          <SafeImage
                            src="/coin-stack.svg"
                            alt="Tokens"
                            width={24}
                            height={24}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-zinc-400 text-sm">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top Up Section */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-4">Purchase Tokens</h2>
              <p className="text-zinc-400 mb-6">
                Select a token package to enhance your experience with premium
                features and content.
              </p>
            </div>

            {/* Token Packages as "radio" but without radio UI */}
            <div className="grid gap-4 mb-6">
              {tokenPackages.map((pkg) => {
                const isSelected = selectedPackage
                  ? selectedPackage.id === pkg.id
                  : false;
                return (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`
                      bg-zinc-900 rounded-xl p-4 border flex items-center w-full text-left relative transition
                      ${pkg.popular ? 'border-pink-500' : 'border-zinc-800'}
                      ${isSelected ? 'ring-2 ring-pink-500 border-pink-500' : ''}
                      hover:border-pink-400
                    `}
                  >
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-tl-none rounded-tr-xl rounded-br-none rounded-bl-xl">
                        POPULAR
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-tl-none rounded-tr-xl rounded-br-none rounded-bl-xl">
                        SELECTED
                      </div>
                    )}
                    <SafeImage
                      src={pkg.image}
                      alt={`${pkg.effectiveTokens} OTT Tokens`}
                      width={48}
                      height={48}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {pkg.effectiveTokens} OTT Tokens
                      </h3>
                      <p className="text-zinc-400">
                        {pkg.bonus && (
                          <span className="text-green-500">{pkg.bonus} • </span>
                        )}
                        ${pkg.price.toFixed(2)} ({pkg.baseTokens} base tokens)
                      </p>
                      <p className="text-xs text-zinc-500">
                        ~${pkg.costPerToken.toFixed(4)} per token
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Methods */}
            {selectedPackage?.id && (
                <div className="flex flex-col gap-4 items-center">
                  <StripeCheckoutButton amount={selectedPackage?.price || 0}/>
                  <div className="relative flex items-center w-full max-w-xs justify-center">
                    <hr className="flex-grow border-t border-gray-700 w-full bg-gray-700"/>
                    <p className="text-gray-700 text-xs mx-4">OR</p>
                    <hr className="flex-grow border-t border-gray-700 w-full"/>
                  </div>
                  <WalletConnect
                      amount={selectedPackage?.price || 0}
                      isCanPay={true}
                  />
                </div>
            )}

            {/*<div className="flex space-x-3">*/}
            {/*  <button*/}
            {/*    onClick={() => setShowTopUp(false)}*/}
            {/*    className="flex-1 bg-zinc-800 py-3 rounded-lg font-medium"*/}
            {/*  >*/}
            {/*    Cancel*/}
            {/*  </button>*/}
            {/*  <button*/}
            {/*    className={`flex-1 bg-pink-500 py-3 rounded-lg font-medium transition*/}
            {/*      ${selectedPackage === null ? 'opacity-50 cursor-not-allowed' : ''}*/}
            {/*    `}*/}
            {/*    disabled={selectedPackage === null}*/}
            {/*    // onClick={() => ...} // тут можно обработать покупку выбранного пакета*/}
            {/*  >*/}
            {/*    Continue*/}
            {/*  </button>*/}
            {/*</div>*/}
          </>
        )}
      </div>
    </div>
  );
}
