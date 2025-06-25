'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Banknote,
  Coins,
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Gift,
  Clock,
  Check,
  Star,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface TokenPackage {
  id: number;
  bonus: string;
  effectiveTokens: number;
  price: number;
  baseTokens: number;
  costPerToken: number;
  image: string;
  popular?: boolean;
  discount?: string;
  savings?: number;
}

interface Transaction {
  id: number;
  type: 'purchase' | 'topup' | 'reward' | 'affiliate';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const setLoading = useLoadingStore(state => state.setLoading);
  const { isMobile } = useWindowSize();

  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stop loading when component mounts
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleBack = () => {
    if (showTopUp) {
      setShowTopUp(false);
      setSelectedPackage(null);
    } else {
      router.back();
    }
  };

  // Enhanced transaction history with status
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'purchase',
      description: 'Premium Content Access',
      amount: -250,
      date: '2023-05-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'topup',
      description: 'Token Package Purchase',
      amount: 1000,
      date: '2023-05-10',
      status: 'completed',
    },
    {
      id: 3,
      type: 'reward',
      description: 'Daily Login Bonus',
      amount: 50,
      date: '2023-05-08',
      status: 'completed',
    },
    {
      id: 4,
      type: 'purchase',
      description: 'AI Voice Call',
      amount: -100,
      date: '2023-05-05',
      status: 'completed',
    },
    {
      id: 5,
      type: 'affiliate',
      description: 'Referral Reward',
      amount: 200,
      date: '2023-05-01',
      status: 'completed',
    },
  ];

  // Enhanced token packages with better pricing
  const tokenPackages: TokenPackage[] = [
    {
      id: 1,
      bonus: 'Starter Pack',
      effectiveTokens: 100,
      price: 9.99,
      baseTokens: 100,
      costPerToken: 0.0999,
      image: '💰',
      discount: '0%',
    },
    {
      id: 2,
      bonus: 'Value Pack',
      effectiveTokens: 350,
      price: 29.99,
      baseTokens: 350,
      costPerToken: 0.0857,
      image: '💎',
      discount: '14%',
      savings: 5.00,
    },
    {
      id: 3,
      bonus: '+10% Bonus',
      effectiveTokens: 550,
      price: 49.99,
      baseTokens: 500,
      costPerToken: 0.0909,
      image: '🎁',
      discount: '20%',
      savings: 12.50,
    },
    {
      id: 4,
      bonus: '+15% Bonus',
      effectiveTokens: 1150,
      price: 99.99,
      baseTokens: 1000,
      costPerToken: 0.0869,
      image: '👑',
      popular: true,
      discount: '25%',
      savings: 33.33,
    },
    {
      id: 5,
      bonus: '+20% Bonus',
      effectiveTokens: 2400,
      price: 199.99,
      baseTokens: 2000,
      costPerToken: 0.0833,
      image: '🏆',
      discount: '30%',
      savings: 85.71,
    },
    {
      id: 6,
      bonus: '+25% Bonus',
      effectiveTokens: 3750,
      price: 299.99,
      baseTokens: 3000,
      costPerToken: 0.0799,
      image: '⭐',
      discount: '35%',
      savings: 161.54,
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <TrendingDown size={16} className="text-red-400" />;
      case 'topup': return <Plus size={16} className="text-green-400" />;
      case 'reward': return <Gift size={16} className="text-yellow-400" />;
      case 'affiliate': return <TrendingUp size={16} className="text-blue-400" />;
      default: return <Coins size={16} className="text-zinc-400" />;
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      ('Processing purchase:', selectedPackage);
      // Handle successful purchase
      setShowTopUp(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
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
              {showTopUp ? 'Purchase Tokens' : 'My Wallet'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {!showTopUp ? (
            <motion.div
              key="wallet-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Balance Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 p-6 shadow-2xl shadow-purple-500/25">
                {/* Background decorations */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm mb-1">Available Balance</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Coins size={24} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-white">
                          {user?.tokens?.toLocaleString() || '850'}
                        </h2>
                        <span className="text-white/80 text-lg">OTT</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">≈ USD Value</p>
                      <p className="text-white font-semibold text-lg">
                        ${((user?.tokens || 850) * 0.1).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setShowTopUp(true)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 border border-white/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus size={18} />
                    Top Up Tokens
                  </motion.button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'This Month', value: '+1,250', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'Last Purchase', value: '1,000', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Total Earned', value: '3,420', icon: Gift, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                  { label: 'Total Spent', value: '2,570', icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900/50 backdrop-blur-xl rounded-xl p-4 border border-zinc-800/50"
                  >
                    <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Transaction History */}
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock size={20} className="text-purple-500" />
                    Recent Transactions
                  </h3>
                  <button className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/30 hover:bg-zinc-800/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          <p className="text-zinc-400 text-sm">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <div className="flex items-center gap-1">
                          <Check size={12} className="text-green-400" />
                          <span className="text-xs text-green-400">Completed</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="token-purchase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Purchase Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Special Offer</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Choose Your Token Package
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                  Get more tokens with bonus packages and unlock premium features
                </p>
              </div>

              {/* Token Packages Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tokenPackages.map((pkg, index) => (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-6 rounded-2xl border transition-all duration-300 text-left group ${
                      selectedPackage?.id === pkg.id
                        ? 'border-pink-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-lg shadow-pink-500/20'
                        : 'border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 hover:bg-zinc-800/50'
                    } ${pkg.popular ? 'scale-105' : 'hover:scale-102'}`}
                    whileHover={{ y: -2 }}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg">
                          <Star className="w-3 h-3" />
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectedPackage?.id === pkg.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}

                    {/* Package Icon */}
                    <div className="text-4xl mb-4">{pkg.image}</div>

                    {/* Package Details */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {pkg.effectiveTokens.toLocaleString()} Tokens
                      </h3>
                      <p className="text-pink-400 text-sm font-medium mb-2">{pkg.bonus}</p>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-white">${pkg.price}</span>
                        {pkg.savings && (
                          <span className="text-sm text-zinc-400 line-through">
                            ${(pkg.price + pkg.savings).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {pkg.discount && pkg.discount !== '0%' && (
                        <div className="inline-block px-2 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-2">
                          <span className="text-xs font-bold text-green-300">Save {pkg.discount}</span>
                        </div>
                      )}

                      <p className="text-xs text-zinc-500">
                        ${pkg.costPerToken.toFixed(4)} per token
                      </p>
                    </div>

                    {/* Package Benefits */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check size={12} className="text-green-400" />
                        <span>{pkg.baseTokens} base tokens</span>
                      </div>
                      {pkg.effectiveTokens > pkg.baseTokens && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Gift size={12} className="text-yellow-400" />
                          <span>+{pkg.effectiveTokens - pkg.baseTokens} bonus tokens</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Zap size={12} className="text-blue-400" />
                        <span>Instant delivery</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Purchase Actions */}
              {selectedPackage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Complete Your Purchase</h3>
                    <p className="text-zinc-400">
                      You're purchasing <span className="text-white font-semibold">{selectedPackage.effectiveTokens.toLocaleString()} tokens</span> for <span className="text-white font-semibold">${selectedPackage.price}</span>
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Payment buttons would go here */}
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-zinc-600 disabled:to-zinc-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} />
                          Pay with Card
                        </>
                      )}
                    </button>

                    <div className="relative flex items-center justify-center">
                      <hr className="flex-grow border-t border-zinc-700/50" />
                      <span className="text-zinc-500 text-sm mx-4 bg-zinc-800/50 px-3 py-1 rounded-full">OR</span>
                      <hr className="flex-grow border-t border-zinc-700/50" />
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-zinc-600 disabled:to-zinc-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Wallet size={16} />
                      Pay with Crypto
                    </button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-xs text-zinc-500">
                      🔒 Secure payment • Instant delivery • 24/7 support
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}