import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Gift,
  Star,
  Zap,
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { usePayment } from '@/lib/hooks/usePayment';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLocale } from '@/contexts/LanguageContext';
import { useModalStore } from '@/lib/stores/modalStore';
import { getUserSubscriptionTier } from '@/lib/services/v1/server/billing';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { Loader } from '@/components/ui/loader';

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

type PaymentMethod = 'card' | 'paypal' | 'crypto' | 'empty';

export default function TokensModal() {
  const router = useRouter();
  const { locale } = useLocale();
  // const { userTier, isLoading } = useSubscription();
  const user = useAuthStore((state) => state.user);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage>();
  const [currentStep, setCurrentStep] = useState<'selection' | 'payment'>(
    'selection'
  );
  const { createPaymentLink } = usePayment(locale);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>('empty');
  const [isProcessing, setIsProcessing] = useState(false);

  const tokenPackages: TokenPackage[] = useMemo(
    () => {
      const basePackages: TokenPackage[] = [
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

      // Add trial package if user is on trial
      if (user?.trial === true) {
        const trialPackage: TokenPackage[] = [
          {
            id: 0,
            bonus: 'Trial Special',
            effectiveTokens: 49,
            price: 1.00,
            baseTokens: 49,
            costPerToken: 0.0204,
            image: '🚀',
            trial: true,
            discount: '95%',
            savings: 3.99,
          },
        ];
        return [...trialPackage, ...basePackages];
      }

      return basePackages;
    },
    [user?.trial]
  );

  const handlePackageSelect = useCallback((pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setCurrentStep('payment');
  }, []);

  const handleBackToSelection = useCallback(() => {
    setCurrentStep('selection');
  }, []);

  const handlePayment = useCallback(async () => {
    if (!selectedPackage || !user) return;

    setIsProcessing(true);

    await createPaymentLink(
      'Tokens',
      user?.email || '',
      user?.firstName || '',
      selectedPackage.price,
      selectedPackage.effectiveTokens
    ).then((res) => {
      router.push(res.url);
    });
  }, [selectedPackage, selectedPaymentMethod, user]);

  const paymentMethods = useMemo(
    () => [
      {
        id: 'Stripe' as PaymentMethod,
        name: 'Stripe',
        icon: '️',
        description: 'Pay with stripe',
      },
      // {
      //   id: 'crypto' as PaymentMethod,
      //   name: 'Crypto',
      //   icon: '₿',
      //   description: 'Bitcoin, Ethereum',
      // },
    ],
    []
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };
  // if (isLoading) {
  //   return <Loader />;
  // }
  //
  // if (!userTier) {
  //   return <p>Please buy subscription then buy tokens</p>;
  // }
  return (
    <div className="bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl w-full h-full ">
      <AnimatePresence mode="wait" custom={currentStep === 'payment' ? 1 : -1}>
        {currentStep === 'selection' ? (
          <motion.div
            key="selection"
            custom={-1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {tokenPackages.map((pkg, index) => (
              <motion.button
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePackageSelect(pkg)}
                className={`min-w-[100%] relative p-6 rounded-2xl border transition-all duration-300 text-left group ${
                  selectedPackage?.id === pkg.id
                    ? 'border-pink-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-lg shadow-pink-500/20'
                    : 'border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 hover:bg-zinc-800/50'
                } ${pkg.popular ? 'scale-105' : 'hover:scale-102'}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
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

                {/* Package Icon */}
                <div className="text-4xl mb-4">{pkg.image}</div>

                {/* Package Details */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {pkg.effectiveTokens.toLocaleString()} Tokens
                  </h3>
                  <p className="text-pink-400 text-sm font-medium mb-2">
                    {pkg.bonus}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">
                      ${pkg.price}
                    </span>
                    {pkg.savings && (
                      <span className="text-sm text-zinc-400 line-through">
                        ${(pkg.price + pkg.savings).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {pkg.discount && pkg.discount !== '0%' && (
                    <div className="inline-block px-2 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-2">
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
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={12} className="text-green-400" />
                    <span>{pkg.baseTokens} base tokens</span>
                  </div>
                  {pkg.effectiveTokens > pkg.baseTokens && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Gift size={12} className="text-yellow-400" />
                      <span>
                        +{pkg.effectiveTokens - pkg.baseTokens} bonus tokens
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Zap size={12} className="text-blue-400" />
                    <span>Instant delivery</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="p-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.button
                onClick={handleBackToSelection}
                className="p-2 rounded-xl bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} className="text-zinc-300" />
              </motion.button>
              <h2 className="text-2xl font-bold text-white">Purchase</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-700/30"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Order Summary
                </h3>

                {selectedPackage && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                      <div className="text-3xl">{selectedPackage.image}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {selectedPackage.effectiveTokens.toLocaleString()}{' '}
                          Tokens
                        </h4>
                        <p className="text-sm text-pink-400">
                          {selectedPackage.bonus}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          ${selectedPackage.price}
                        </div>
                        {selectedPackage.savings && (
                          <div className="text-sm text-zinc-400 line-through">
                            $
                            {(
                              selectedPackage.price + selectedPackage.savings
                            ).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-zinc-700/30">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Base tokens:</span>
                        <span className="text-white">
                          {selectedPackage.baseTokens}
                        </span>
                      </div>
                      {selectedPackage.effectiveTokens >
                        selectedPackage.baseTokens && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Bonus tokens:</span>
                          <span className="text-green-400">
                            +
                            {selectedPackage.effectiveTokens -
                              selectedPackage.baseTokens}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Cost per token:</span>
                        <span className="text-white">
                          ${selectedPackage.costPerToken.toFixed(4)}
                        </span>
                      </div>
                      {selectedPackage.savings && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">You save:</span>
                          <span className="text-green-400">
                            ${selectedPackage.savings.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-zinc-700/30">
                      <span className="text-white">Total:</span>
                      <span className="text-white">
                        ${selectedPackage.price}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                          selectedPaymentMethod === method.id
                            ? 'border-pink-500 bg-gradient-to-r from-pink-500/10 to-purple-500/10'
                            : 'border-zinc-700/50 bg-zinc-800/50 hover:border-zinc-600/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {method.name === 'Stripe' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                width="21"
                                height="21"
                                fill="#6772e5"
                              >
                                <path
                                  d="M111.328 15.602c0-4.97-2.415-8.9-7.013-8.9s-7.423 3.924-7.423 8.863c0 5.85 3.32 8.8 8.036 8.8 2.318 0 4.06-.528 5.377-1.26V19.22a10.246 10.246 0 0 1-4.764 1.075c-1.9 0-3.556-.67-3.774-2.943h9.497a39.64 39.64 0 0 0 .063-1.748zm-9.606-1.835c0-2.186 1.35-3.1 2.56-3.1s2.454.906 2.454 3.1zM89.4 6.712a5.434 5.434 0 0 0-3.801 1.509l-.254-1.208h-4.27v22.64l4.85-1.032v-5.488a5.434 5.434 0 0 0 3.444 1.265c3.472 0 6.64-2.792 6.64-8.957.003-5.66-3.206-8.73-6.614-8.73zM88.23 20.1a2.898 2.898 0 0 1-2.288-.906l-.03-7.2a2.928 2.928 0 0 1 2.315-.96c1.775 0 2.998 2 2.998 4.528.003 2.593-1.198 4.546-2.995 4.546zM79.25.57l-4.87 1.035v3.95l4.87-1.032z"
                                  fillRule="evenodd"
                                />
                                <path d="M74.38 7.035h4.87V24.04h-4.87z" />
                                <path
                                  d="M69.164 8.47l-.302-1.434h-4.196V24.04h4.848V12.5c1.147-1.5 3.082-1.208 3.698-1.017V7.038c-.646-.232-2.913-.658-4.048 1.43zm-9.73-5.646L54.698 3.83l-.02 15.562c0 2.87 2.158 4.993 5.038 4.993 1.585 0 2.756-.302 3.405-.643v-3.95c-.622.248-3.683 1.138-3.683-1.72v-6.9h3.683V7.035h-3.683zM46.3 11.97c0-.758.63-1.05 1.648-1.05a10.868 10.868 0 0 1 4.83 1.25V7.6a12.815 12.815 0 0 0-4.83-.888c-3.924 0-6.557 2.056-6.557 5.488 0 5.37 7.375 4.498 7.375 6.813 0 .906-.78 1.186-1.863 1.186-1.606 0-3.68-.664-5.307-1.55v4.63a13.461 13.461 0 0 0 5.307 1.117c4.033 0 6.813-1.992 6.813-5.485 0-5.796-7.417-4.76-7.417-6.943zM13.88 9.515c0-1.37 1.14-1.9 2.982-1.9A19.661 19.661 0 0 1 25.6 9.876v-8.27A23.184 23.184 0 0 0 16.862.001C9.762.001 5 3.72 5 9.93c0 9.716 13.342 8.138 13.342 12.326 0 1.638-1.4 2.146-3.37 2.146-2.905 0-6.657-1.202-9.6-2.802v8.378A24.353 24.353 0 0 0 14.973 32C22.27 32 27.3 28.395 27.3 22.077c0-10.486-13.42-8.613-13.42-12.56z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            ) : (
                              method.icon
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white">
                              {method.name}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {method.description}
                            </div>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <Check size={20} className="text-pink-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={16} className="text-green-400" />
                    <span className="text-sm font-medium text-white">
                      Secure Payment
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-green-400" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-blue-400" />
                      <span>Instant token delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={12} className="text-purple-400" />
                      <span>PCI DSS compliant</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || selectedPaymentMethod === 'empty'}
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
                      Complete Purchase
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
