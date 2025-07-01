'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  Plus,
  CreditCard,
  Wallet,
  Gift,
  Check,
  Star,
  Zap,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import TokensModal from '@/components/modals/tokens';
import { useModalStore } from '@/lib/stores/modalStore';
import { PaymentHistoryResponse, Transaction } from '@/lib/types/payments';
import { usePaymentHistory } from '@/lib/hooks/usePaymentHistory';
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

interface WalletPageProps {
  history: PaymentHistoryResponse;
}

export default function WalletPage({ history }: WalletPageProps) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [userTokens, setUserTokens] = useState(0);
  const router = useRouter();
  const { openModal, closeModal } = useModalStore();
  const { isMobile } = useWindowSize()

  // Хук для пагинации истории
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    prevPage,
    refresh,
    hasNextPage,
    hasPrevPage,
  } = usePaymentHistory(history);

  const handleBack = () => {
    if (showTopUp || showHistory) {
      setShowTopUp(false);
      setShowHistory(false);
      setSelectedPackage(null);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    setUserTokens(Number(user?.balances.oTT));
  }, [user]);

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
      savings: 5.0,
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
      savings: 12.5,
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

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowTopUp(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.direction === 'received') {
      return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-400" />;
  };

  const getTransactionColor = (transaction: Transaction) => {
    if (transaction.direction === 'received') {
      return 'text-green-400';
    }
    return 'text-red-400';
  };

  const getTransactionSign = (transaction: Transaction) => {
    return transaction.direction === 'received' ? '+' : '-';
  };

  const getPaginationRange = () => {
    const delta = 2; // Количество страниц слева и справа от текущей
    const totalVisible = 5; // Максимальное количество видимых страниц

    if (totalPages <= totalVisible) {
      // Если страниц мало, показываем все
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Корректируем диапазон, чтобы всегда показывать 5 страниц
    if (end - start < totalVisible - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + totalVisible - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - totalVisible + 1);
      }
    }

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-zinc-400 bg-zinc-500/20 border-zinc-500/30';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isMobile && 'bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/30 shadow-2xl'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
            >
              <ArrowLeft size={20} className="text-zinc-300" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              {showTopUp ? 'Purchase Tokens' : showHistory ? 'Transaction History' : 'My Wallet'}
            </h1>
          </div>
          {showHistory && (
            <button
              onClick={refresh}
              disabled={historyLoading}
              className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50 disabled:opacity-50"
            >
              <RefreshCw size={20} className={`text-zinc-300 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {!showTopUp && !showHistory ? (
            <motion.div
              key="wallet-main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Main Balance Section */}
              <div className="flex flex-col items-center justify-start min-h-[60vh] text-center">
                {/* Balance Display */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
                    <Coins className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">
                      Available Balance
                    </span>
                  </div>

                  <div className="relative">
                    <div className="text-8xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent mb-2">
                      {userTokens.toLocaleString()}
                    </div>
                    <div className="text-2xl text-zinc-400 font-medium">
                      OTT Tokens
                    </div>
                    <div className="text-lg text-zinc-500 mt-2">
                      ≈ ${(userTokens * 0.1).toFixed(2)} USD
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
                >
                  <motion.button
                    onClick={() =>
                      openModal({
                        type: 'message',
                        content: <TokensModal />,
                      })
                    }
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={20} />
                    Add Tokens
                  </motion.button>

                  <motion.button
                    onClick={() => setShowHistory(true)}
                    className="flex-1 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar size={20} />
                    History
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : showHistory ? (
            <motion.div
              key="transaction-history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* History Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">
                    Transaction History
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Payment History
                </h2>
                <p className="text-zinc-400 text-lg">
                  {totalCount} transactions total
                </p>
              </div>

              {/* Statistics Cards */}
              {historyData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium text-green-300">Total Received</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {historyData.total_received?.OTT || 0} OTT
                    </div>
                    <div className="text-sm text-zinc-400">
                      ${((historyData.total_received?.USD || 0)).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-medium text-red-300">Total Sent</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {historyData.total_sent?.OTT || 0} OTT
                    </div>
                    <div className="text-sm text-zinc-400">
                      ${((historyData.total_sent?.USD || 0)).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">Current Balance</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {historyData.balanceSummary?.OTT || userTokens} OTT
                    </div>
                    <div className="text-sm text-zinc-400">
                      ${((historyData.balanceSummary?.USD || 0)).toFixed(2)} USD
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions List */}
              <div className="space-y-4">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                ) : historyError ? (
                  <div className="text-center py-12">
                    <p className="text-red-400 mb-4">{historyError}</p>
                    <button
                      onClick={refresh}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : historyData?.transactions?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-zinc-400">No transactions found</p>
                  </div>
                ) : (
                  historyData?.transactions?.map((transaction, index) => (
                    <motion.div
                      key={transaction.transactionId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex-shrink-0">
                            {getTransactionIcon(transaction)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-white truncate min-w-0 flex-1">
                                {transaction.comment || transaction.transactionType}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                {formatDate(transaction.createdAt)}
                              </span>
                              <span className="flex items-center gap-1 min-w-0">
                                <Hash className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {transaction.hash.substring(0, 8)}...
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className={`text-lg sm:text-xl font-bold ${getTransactionColor(transaction)}`}>
                            {getTransactionSign(transaction)}{transaction.amount} {transaction.currency}
                          </div>
                          {transaction.currency === 'OTT' && (
                            <div className="text-xs sm:text-sm text-zinc-500">
                              ≈ ${(transaction.amount * 0.1).toFixed(2)} USD
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {historyData && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                  <button
                    onClick={prevPage}
                    disabled={!hasPrevPage || historyLoading}
                    className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
                  >
                    <ChevronLeft size={20} className="text-zinc-300" />
                  </button>

                  {/* Показываем "..." если есть пропуск в начале */}
                  {getPaginationRange()[0] > 1 && (
                    <>
                      <button
                        onClick={() => goToPage(1)}
                        disabled={historyLoading}
                        className="w-10 h-10 rounded-xl font-medium transition-all duration-300 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 disabled:opacity-50"
                      >
                        1
                      </button>
                      {getPaginationRange()[0] > 2 && (
                        <span className="px-2 text-zinc-500">...</span>
                      )}
                    </>
                  )}

                  {/* Основные страницы */}
                  <div className="flex items-center gap-2">
                    {getPaginationRange().map((page) => {
                      const isActive = page === currentPage;

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          disabled={historyLoading}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50'
                          } disabled:opacity-50`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Показываем "..." если есть пропуск в конце */}
                  {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
                    <>
                      {getPaginationRange()[getPaginationRange().length - 1] < totalPages - 1 && (
                        <span className="px-2 text-zinc-500">...</span>
                      )}
                      <button
                        onClick={() => goToPage(totalPages)}
                        disabled={historyLoading}
                        className="w-10 h-10 rounded-xl font-medium transition-all duration-300 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 disabled:opacity-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={nextPage}
                    disabled={!hasNextPage || historyLoading}
                    className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
                  >
                    <ChevronRight size={20} className="text-zinc-300" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="token-purchase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-8"
            >
              {/* Purchase Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Special Offer
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Choose Your Package
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                  Get more tokens with bonus packages and unlock premium features
                </p>
              </div>

              {/* Token Packages Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tokenPackages.map((pkg, index) => (
                  <motion.button
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-6 rounded-3xl border transition-all duration-300 text-left group ${
                      selectedPackage?.id === pkg.id
                        ? 'border-pink-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-lg shadow-pink-500/20 scale-105'
                        : 'border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 hover:bg-zinc-800/50 hover:scale-102'
                    } ${pkg.popular ? 'ring-2 ring-pink-500/50' : ''}`}
                    whileHover={{ y: -4 }}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg">
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

                    {/* Package Content */}
                    <div className="text-center">
                      <div className="text-5xl mb-4">{pkg.image}</div>

                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {pkg.effectiveTokens.toLocaleString()}
                        </h3>
                        <p className="text-pink-400 text-sm font-medium mb-3">
                          {pkg.bonus}
                        </p>

                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-3xl font-bold text-white">
                            ${pkg.price}
                          </span>
                          {pkg.savings && (
                            <span className="text-sm text-zinc-400 line-through">
                              ${(pkg.price + pkg.savings).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {pkg.discount && pkg.discount !== '0%' && (
                          <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-3">
                            <span className="text-xs font-bold text-green-300">
                              Save {pkg.discount}
                            </span>
                          </div>
                        )}

                        <p className="text-xs text-zinc-500">
                          ${pkg.costPerToken.toFixed(4)} per token
                        </p>
                      </div>

                      {/* Package Benefits */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center gap-2 text-zinc-400">
                          <Check size={12} className="text-green-400" />
                          <span>{pkg.baseTokens} base tokens</span>
                        </div>
                        {pkg.effectiveTokens > pkg.baseTokens && (
                          <div className="flex items-center justify-center gap-2 text-zinc-400">
                            <Gift size={12} className="text-yellow-400" />
                            <span>
                              +{pkg.effectiveTokens - pkg.baseTokens} bonus
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-2 text-zinc-400">
                          <Clock size={12} className="text-blue-400" />
                          <span>Instant delivery</span>
                        </div>
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
                  className="max-w-md mx-auto"
                >
                  <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 border border-zinc-700/50">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Complete Purchase
                      </h3>
                      <p className="text-zinc-400">
                        <span className="text-white font-semibold">
                          {selectedPackage.effectiveTokens.toLocaleString()}{' '}
                          tokens
                        </span>{' '}
                        for{' '}
                        <span className="text-white font-semibold">
                          ${selectedPackage.price}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-zinc-600 disabled:to-zinc-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} />
                            Pay with Card
                          </>
                        )}
                      </button>

                      <div className="relative flex items-center justify-center">
                        <hr className="flex-grow border-t border-zinc-700/50" />
                        <span className="text-zinc-500 text-sm mx-4 bg-zinc-800/50 px-4 py-2 rounded-full">
                          OR
                        </span>
                        <hr className="flex-grow border-t border-zinc-700/50" />
                      </div>

                      <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-zinc-600 disabled:to-zinc-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        <Wallet size={18} />
                        Pay with Crypto
                      </button>
                    </div>

                    <div className="text-center mt-6">
                      <p className="text-xs text-zinc-500 flex items-center justify-center gap-2">
                        <Shield size={12} />
                        Secure payment • Instant delivery • 24/7 support
                      </p>
                    </div>
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