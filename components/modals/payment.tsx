'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Shield,
  Lock,
  Check,
  Star,
  Zap,
  Bitcoin,
  ArrowRight,
  Info, Wrench, Clock,
} from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  tokens?: number;
  onClose: () => void;
  cryptoEnabled: boolean
}

export default function PaymentModal({
  amount,
  tokens,
  onClose,
  cryptoEnabled = false
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    'stripe' | 'crypto' | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      gradient: 'from-blue-600 to-blue-700',
      hoverGradient: 'from-blue-700 to-blue-800',
      features: ['Instant processing', 'Secure payment', 'Worldwide accepted'],
      processingTime: 'Instant',
      fees: 'No additional fees',
      enabled: true,
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: cryptoEnabled
        ? 'Bitcoin, Ethereum, USDT, and more'
        : 'Coming soon - Currently in development',
      icon: Bitcoin,
      gradient: 'from-orange-600 to-orange-700',
      hoverGradient: 'from-orange-700 to-orange-800',
      features: cryptoEnabled
        ? ['Anonymous payment', 'Low fees', 'Decentralized']
        : ['In development', 'Coming soon', 'Stay tuned'],
      processingTime: cryptoEnabled ? '5-15 minutes' : 'Not available',
      fees: cryptoEnabled ? 'Network fees apply' : 'Coming soon',
      enabled: cryptoEnabled,
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`Processing ${selectedMethod} payment for $${amount}`);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="inset-0 bg-black/60 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <div className="inset-0 z-50 flex items-center justify-center p-4 ">
          <div

            className="w-full max-w-lg bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-zinc-800/50">
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                    <Zap className="w-8 h-8 text-purple-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Complete Your Purchase
                </h2>

                <div className="text-center space-y-1">
                  {tokens && (
                    <p className="text-zinc-400">
                      You're purchasing{' '}
                      <span className="text-white font-semibold">
                        {tokens.toLocaleString()} tokens
                      </span>
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-white">
                      ${amount.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                      <Star className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-green-300">
                        Best Value
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Choose Payment Method
              </h3>

              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <motion.button
                    key={method.id}
                    variants={itemVariants}
                    custom={index}
                    onClick={() => {
                      if (method.enabled) {
                        setSelectedMethod(method.id as 'stripe' | 'crypto');
                      }
                    }}
                    disabled={!method.enabled}
                    className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left group relative overflow-hidden ${
                      !method.enabled
                        ? 'border-zinc-700/30 bg-zinc-800/20 cursor-not-allowed opacity-60'
                        : selectedMethod === method.id
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/20'
                          : 'border-zinc-800/50 bg-zinc-800/30 hover:border-zinc-700/50 hover:bg-zinc-800/50 cursor-pointer'
                    }`}
                    whileHover={
                      method.enabled
                        ? {
                          scale: 1.02,
                          y: -2,
                          transition: { duration: 0.2 },
                        }
                        : {}
                    }
                    whileTap={method.enabled ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Анимированный фон при выборе */}
                    {selectedMethod === method.id && method.enabled && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Overlay для отключенных методов */}
                    {!method.enabled && (
                      <motion.div
                        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[1px] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <motion.div

                          >
                            <Wrench className="w-4 h-4 text-amber-400" />
                          </motion.div>
                          <span className="text-sm font-semibold text-amber-300">
              Coming Soon
            </span>
                        </motion.div>
                      </motion.div>)}

                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${
                            method.enabled ? method.gradient : 'from-zinc-600 to-zinc-700'
                          } shadow-lg relative overflow-hidden`}
                          whileHover={
                            method.enabled
                              ? {
                                scale: 1.1,
                                rotate: 5,
                              }
                              : {}
                          }
                          transition={{ duration: 0.2 }}
                        >
                          {/* Анимированный блик */}
                          {method.enabled && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{
                                x: ['-100%', '100%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                repeatDelay: 3,
                              }}
                            />
                          )}
                          <method.icon
                            className={`w-6 h-6 relative z-10 ${
                              method.enabled ? 'text-white' : 'text-zinc-400'
                            }`}
                          />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${method.enabled ? 'text-white' : 'text-zinc-400'}`}>
                              {method.name}
                            </h4>
                            {!method.enabled && (
                              <motion.div
                                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30"
                                animate={{
                                  opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              >
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span className="text-xs font-medium text-amber-300">
                    In Development
                  </span>
                              </motion.div>)}
                          </div>
                          <p className={`text-sm mb-2 ${method.enabled ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {method.description}
                          </p>

                          <div className="space-y-1">
                            {method.features.map((feature, featureIndex) => (
                              <motion.div
                                key={featureIndex}
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: index * 0.1 + featureIndex * 0.05,
                                }}
                              >
                                <motion.div animate={
                                  method.enabled
                                    ? {
                                      scale: [1, 1.2, 1],
                                    }
                                    : {}
                                }
                                            transition={{
                                              duration: 2,
                                              repeat: Infinity,
                                              ease: 'easeInOut',
                                              delay: featureIndex * 0.2,
                                            }}
                                >
                                  {method.enabled ? (
                                    <Check className="w-3 h-3 text-green-400" />
                                  ) : (
                                    <Clock className="w-3 h-3 text-amber-400" />
                                  )}
                                </motion.div>
                                <span className={`text-xs ${method.enabled ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    {feature}
                  </span>
                              </motion.div>))}
                          </div>
                        </div>
                      </div>
                      {/* Selection indicator */}
                      <motion.div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          !method.enabled
                            ? 'border-zinc-600 bg-zinc-700'
                            : selectedMethod === method.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-zinc-600'
                        }`}
                        animate={
                          selectedMethod === method.id && method.enabled
                            ? {
                              scale: [1, 1.2, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(168, 85, 247, 0.4)',
                                '0 0 0 8px rgba(168, 85, 247, 0)',
                              ],
                            }
                            : {}
                        }
                        transition={{ duration: 0.6 }}
                      >
                        <AnimatePresence>            {selectedMethod === method.id && method.enabled && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>)}
                          {!method.enabled && (
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              <Clock className="w-3 h-3 text-zinc-400" />
                            </motion.div>)}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    {/* Method details */}
                    <motion.div
                      className="mt-3 pt-3 border-t border-zinc-700/30 flex items-center justify-between text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center gap-1 ${method.enabled ? 'text-zinc-500' : 'text-zinc-600'}`}>
                          <motion.div animate={
                            method.enabled
                              ? { rotate: [0, 360] }
                              : { rotate: [0, 180, 0] }
                          }
                                      transition={{
                                        duration: method.enabled ? 4 : 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                      }}
                          >
                            <Info className="w-3 h-3" />
                          </motion.div>
                          <span>Processing: {method.processingTime}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${method.enabled ? 'text-zinc-500' : 'text-zinc-600'}`}>
                          <motion.div animate={{
                            scale: [1, 1.1, 1],
                          }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                      }}
                          >
                            <Lock className="w-3 h-3" />
                          </motion.div>
                          <span>{method.fees}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.button>))}
              </div>
              {/* Payment Button */}
              {selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-gradient-to-r ${
                      paymentMethods.find((m) => m.id === selectedMethod)
                        ?.gradient
                    } hover:${paymentMethods.find((m) => m.id === selectedMethod)?.hoverGradient} disabled:from-zinc-600 disabled:to-zinc-700 text-white`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ${amount.toFixed(2)}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Security Notice */}
              {/*<div className="mt-6 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">*/}
              {/*  <div className="flex items-start gap-3">*/}
              {/*    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">*/}
              {/*      <Shield className="w-4 h-4 text-green-400" />*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <h4 className="text-sm font-semibold text-white mb-1">*/}
              {/*        Secure Payment*/}
              {/*      </h4>*/}
              {/*      <p className="text-xs text-zinc-400 leading-relaxed">*/}
              {/*        Your payment information is encrypted and secure. We never*/}
              {/*        store your payment details. All transactions are processed*/}
              {/*        through industry-standard security protocols.*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/* Footer */}
              <div className="text-center pt-4 border-t border-zinc-800/30">
                <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Instant Delivery</span>
                  </div>
                  <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AnimatePresence>
  );
}
