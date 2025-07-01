'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Star,
  Zap,
  Shield,
  Gift,
  Crown,
  Sparkles,
  CreditCard,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LanguageContext';
import {
  SubscriptionResponse,
  SubscriptionTier,
  UserSubscriptionResponse,
} from '@/lib/types/billing';
import { usePayment } from '@/lib/hooks/usePayment';
import { motion } from 'framer-motion';
import ErrorPopup from '@/components/modals/error';
import { useModalStore } from '@/lib/stores/modalStore';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';
import { AxiosError } from 'axios';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import CancelSubscription from '@/components/modals/cancel-subscription';

interface SubscriptionSectionProps {
  tiers: SubscriptionResponse | undefined;
  userSubscriptionTier: UserSubscriptionResponse;
}

interface Plan {
  id: string;
  name: string;
  discount: string;
  originalPrice: string;
  price: string;
  amount: number;
  billing: string;
  savings: string;
  popular: boolean;
  icon: React.ReactNode;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  billingCycle: string;
  billingId: string;
}

export default function SubscriptionSection({
  tiers,
  userSubscriptionTier,
}: SubscriptionSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('great-value');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();
  const { dictionary, locale } = useLocale();
  const { purchaseSubscription, cancelSubscription } = usePayment(locale);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { openModal, closeModal } = useModalStore((state) => state);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { errorHandler } = useErrorHandler();
  const { isMobile } = useWindowSize();

  // Check if user has active global subscription
  const hasActiveSubscription =
    userSubscriptionTier?.globalSubscription?.status === 'active';
  const currentSubscription = userSubscriptionTier?.globalSubscription;

  // Helper function to calculate discount percentage
  const calculateDiscount = (
    originalPrice: number,
    currentPrice: number
  ): string => {
    const discount = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100
    );
    return `${discount}% OFF`;
  };

  // Helper function to format price for display
  const formatPrice = (priceCents: number): string => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  // Helper function to get plan configuration based on billing cycle
  const getPlanConfig = (billingCycle: string) => {
    switch (billingCycle) {
      case 'month':
      case 'monthly':
        return {
          id: 'flexible',
          popular: false,
          icon: <Zap className="w-6 h-6" />,
          color: 'blue',
          gradientFrom: 'from-blue-500/20',
          gradientTo: 'to-cyan-500/20',
        };
      case 'quarter':
      case 'quarterly':
        return {
          id: 'great-value',
          popular: true,
          icon: <Crown className="w-6 h-6" />,
          color: 'pink',
          gradientFrom: 'from-pink-500/20',
          gradientTo: 'to-purple-500/20',
        };
      case 'year':
      case 'annual':
        return {
          id: 'ultimate',
          popular: false,
          icon: <Sparkles className="w-6 h-6" />,
          color: 'purple',
          gradientFrom: 'from-purple-500/20',
          gradientTo: 'to-indigo-500/20',
        };
      default:
        return {
          id: billingCycle,
          popular: false,
          icon: <Zap className="w-6 h-6" />,
          color: 'blue',
          gradientFrom: 'from-blue-500/20',
          gradientTo: 'to-cyan-500/20',
        };
    }
  };

  // Helper function to calculate actual total price based on billing cycle
  const calculateTotalPrice = (
    priceCents: number,
    billingCycle: string
  ): number => {
    switch (billingCycle) {
      case 'quarterly':
        return priceCents * 3; // 3 months
      case 'annual':
        return priceCents * 12; // 12 months
      default:
        return priceCents; // monthly
    }
  };

  // Define plan hierarchy for upgrades
  const planHierarchy = ['monthly', 'quarterly', 'annual'];

  // Get current plan tier index
  const getCurrentPlanTierIndex = () => {
    if (!hasActiveSubscription || !currentSubscription) return -1;
    return planHierarchy.indexOf(currentSubscription.billingCycle);
  };

  // Convert API tiers to Plan format
  const plans: Plan[] = useMemo(() => {
    if (!tiers?.tiers) return [];

    // Find monthly tier to use as baseline for discount calculation
    const monthlyTier = tiers.tiers.find(
      (tier) => tier.billingCycle === 'monthly'
    );
    const baseMonthlyPrice = monthlyTier?.priceCents || 1999;

    const currentTierIndex = getCurrentPlanTierIndex();

    return tiers.tiers
      .map((tier: SubscriptionTier) => {
        const config = getPlanConfig(tier.billingCycle);

        // Calculate savings text based on billing cycle
        let savings = '-';
        if (tier.billingCycle === 'quarterly') {
          savings = dictionary.subscription.savings.quarterly;
        } else if (tier.billingCycle === 'annual') {
          savings = dictionary.subscription.savings.annually;
        }

        // Calculate discount based on comparison with monthly price
        const discountPercent =
          tier.billingCycle !== 'monthly'
            ? Math.round(
                ((baseMonthlyPrice - tier.priceCents) / baseMonthlyPrice) * 100
              )
            : 0;

        // Calculate the total amount to be charged
        const totalAmount = calculateTotalPrice(
          tier.priceCents,
          tier.billingCycle
        );

        return {
          id: config.id,
          name: tier.name,
          discount:
            discountPercent > 0 ? `${discountPercent}% OFF` : 'Standard',
          originalPrice: formatPrice(baseMonthlyPrice),
          price: tier.displayPrice, // Use the displayPrice directly from API
          amount: totalAmount / 100, // Convert to dollars for payment
          billing: tier.billingCycle,
          billingId: tier.subscriptionId,
          billingCycle: tier.billingCycle,
          savings,
          popular: config.popular,
          icon: config.icon,
          color: config.color,
          gradientFrom: config.gradientFrom,
          gradientTo: config.gradientTo,
        };
      })
      .filter((plan) => {
        // If user has active subscription, only show upgrade options
        if (hasActiveSubscription && currentTierIndex >= 0) {
          const planTierIndex = planHierarchy.indexOf(plan.billingCycle);
          return planTierIndex > currentTierIndex; // Only show higher tier plans
        }
        return true; // Show all plans if no active subscription
      });
  }, [
    tiers,
    dictionary.subscription,
    hasActiveSubscription,
    currentSubscription,
  ]);

  const features = useMemo(
    () => [
      { icon: '🤖', text: dictionary.subscription.features.createAI },
      { icon: '💬', text: dictionary.subscription.features.unlimitedText },
      { icon: '🎁', text: dictionary.subscription.features.bonusTokens },
      { icon: '🖼️', text: dictionary.subscription.features.removeBlur },
      { icon: '🎨', text: dictionary.subscription.features.generateImages },
      { icon: '📞', text: dictionary.subscription.features.phoneCalls },
      { icon: '⚡', text: dictionary.subscription.features.fastResponse },
    ],
    [dictionary.subscription.features]
  );

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  const handleBack = () => {
    router.push('/profile');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentPlanConfig = () => {
    if (!currentSubscription) return null;
    return getPlanConfig(currentSubscription.billingCycle);
  };

  // Show loading state if tiers are not loaded yet
  if (!tiers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading subscription plans...</p>
        </div>
      </div>
    );
  }
  const handlePayment = async () => {
    if (!selectedPlanData?.billingId) return;
    setIsProcessing(true);

    await purchaseSubscription(
      selectedPlanData.billingId,
      selectedPlanData.billingCycle
    )
      .then((res) => {
        if (res.error) {
          errorHandler(res.error as AxiosError);
          return;
        }
        router.push(res.url);
      })
      .finally(() => setIsProcessing(false));
  };

  const handleCancelSubscription = async () => {
    openModal({
      type: 'message',
      content: (
        <CancelSubscription
          onConfirm={async (atPeriod: boolean) => {
            setLoading(true);
            await cancelSubscription(
              currentSubscription?.stripeSubscriptionId,
              atPeriod
            )
              .then((res) => {
                if (res.error) {
                  errorHandler(res.error as AxiosError);
                  return;
                }
                window.location.reload();
              })
              .finally(() => setLoading(false));
          }}
        />
      ),
    });
  };

  const currentPlanConfig = getCurrentPlanConfig();

  return (
    <div className="min-h-screen">
      {/* Back Button Header */}
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
              {dictionary.subscription.subscription}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 mx-auto">
        {/* Current Subscription Display */}
        {hasActiveSubscription && currentSubscription && currentPlanConfig && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div
                className={`flex items-start justify-between ${isMobile && 'flex-col'}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentPlanConfig.gradientFrom} ${currentPlanConfig.gradientTo} flex items-center justify-center border border-${currentPlanConfig.color}-500/30`}
                  >
                    <div className={`text-${currentPlanConfig.color}-400`}>
                      {currentPlanConfig.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">
                        Current Plan:{' '}
                        {currentSubscription.billingCycle
                          .charAt(0)
                          .toUpperCase() +
                          currentSubscription.billingCycle.slice(1)}
                      </h3>
                      <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                        <span className="text-emerald-300 text-sm font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-semibold text-white">
                        {formatPrice(currentSubscription.priceCents)}
                        <span className="text-zinc-400 text-sm ml-1">
                          /
                          {currentSubscription.billingCycle === 'annual'
                            ? 'year'
                            : currentSubscription.billingCycle === 'quarterly'
                              ? 'quarter'
                              : 'month'}
                        </span>
                      </span>
                      <div className="flex items-center gap-1 text-zinc-400 text-sm">
                        <Calendar size={14} />
                        <span>
                          Since {formatDate(currentSubscription.activatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-zinc-300 text-sm">
                        Monthly Tokens:{' '}
                        <span className="font-semibold text-white">
                          {currentSubscription.monthlyOttAllocation}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`flex gap-3 ${isMobile && 'mt-4 ml-auto'}`}>
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        {plans.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-4">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-300">
                  {hasActiveSubscription
                    ? 'Upgrade Your Plan'
                    : dictionary.subscription.limitedTimeOffer}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                {hasActiveSubscription
                  ? 'Upgrade to Premium AI'
                  : dictionary.subscription.unlockPremiumAI}
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                {hasActiveSubscription
                  ? 'Get more features and better performance'
                  : dictionary.subscription.saveUpTo70}
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {dictionary.subscription.everythingIncluded}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-zinc-300 font-medium">
                      {feature.text}
                    </span>
                    <Check size={16} className="text-emerald-400 ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Plans */}
            <div
              className={`grid gap-6 mb-8 ${plans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-3'}`}
            >
              {plans.map((plan) => {
                const isCurrentPlan =
                  hasActiveSubscription &&
                  currentSubscription?.billingCycle === plan.billingCycle;

                return (
                  <div
                    key={plan.id}
                    className={`relative group cursor-pointer transition-all duration-100 ${
                      isCurrentPlan
                        ? 'opacity-50 cursor-not-allowed'
                        : selectedPlan === plan.id
                          ? 'scale-105'
                          : 'hover:scale-105'
                    }`}
                    onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                  >
                    {/* Glassmorphism Card */}
                    <div
                      className={`
                      relative p-6 rounded-2xl transition-all duration-100
                      ${
                        isCurrentPlan
                          ? 'bg-zinc-800/30 border border-zinc-700/30'
                          : selectedPlan === plan.id
                            ? `bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} border-2 border-${plan.color}-500/50 shadow-2xl shadow-${plan.color}-500/20`
                            : 'bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50'
                      }
                    `}
                    >
                      {/* Current Plan Badge */}
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
                            <Check className="w-3 h-3" />
                            Current Plan
                          </div>
                        </div>
                      )}

                      {/* Popular Badge */}
                      {plan.popular && !isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg">
                            <Crown className="w-3 h-3" />
                            {dictionary.subscription.mostPopular}
                          </div>
                        </div>
                      )}

                      {/* Plan Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} flex items-center justify-center mb-4 border border-${plan.color}-500/30`}
                      >
                        <div className={`text-${plan.color}-400`}>
                          {plan.icon}
                        </div>
                      </div>

                      {/* Plan Details */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-white">
                            {plan.price}
                          </span>
                          {plan.billingCycle !== 'monthly' && (
                            <span className="text-sm text-zinc-400 line-through">
                              {plan.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mb-1">
                          {plan.billingCycle.toUpperCase()}
                        </p>
                        {plan.savings !== '-' && (
                          <p className="text-sm text-emerald-400 font-medium">
                            {plan.savings}
                          </p>
                        )}
                        <div className="inline-block px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mt-2">
                          <span className="text-xs font-bold text-amber-300">
                            {plan.discount}
                          </span>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {!isCurrentPlan && (
                        <div
                          className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${
                            selectedPlan === plan.id
                              ? `border-${plan.color}-500 bg-${plan.color}-500 shadow-lg shadow-${plan.color}-500/50`
                              : 'border-zinc-600 bg-transparent'
                          }
                        `}
                        >
                          {selectedPlan === plan.id && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : hasActiveSubscription ? (
          /* No upgrade options available */
          <div className="text-center py-12"></div>
        ) : null}

        {/* Action Section */}
        {selectedPlan && selectedPlanData && plans.length > 0 && (
          <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {hasActiveSubscription
                  ? 'Upgrade Your Plan'
                  : dictionary.subscription.readyToStart}
              </h3>
              <p className="text-zinc-400">
                {hasActiveSubscription
                  ? 'You are upgrading to'
                  : dictionary.subscription.youSelected}{' '}
                <span className="text-white font-semibold">
                  {selectedPlanData.name}
                </span>{' '}
                {dictionary.subscription.plan}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-2xl font-bold text-white">
                  {selectedPlanData.price}
                </span>
                <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                  {selectedPlanData.discount}
                </span>
              </div>
              {/* Show total payment amount */}
              <div className="text-center mt-2">
                <p className="text-zinc-400 text-sm">
                  Total payment:{' '}
                  <span className="text-white font-semibold">
                    ${selectedPlanData.amount.toFixed(2)}
                  </span>
                  {selectedPlanData.billingCycle !== 'monthly' && (
                    <span className="text-zinc-500 text-xs ml-1">
                      (billed {selectedPlanData.billingCycle})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
              <div className="relative flex items-center w-full justify-center">
                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedPlan}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-zinc-600 disabled:to-zinc-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      {hasActiveSubscription
                        ? 'Upgrade Plan'
                        : 'Complete Purchase'}
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-zinc-500">
                {dictionary.subscription.securePayment}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Cancel Subscription
              </h3>
            </div>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to cancel your subscription? You'll lose
              access to premium features at the end of your current billing
              period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors duration-200"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Plan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
