'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Check, Star, Zap, Shield, Gift, Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LanguageContext';

interface SubscriptionSectionProps {
  onBack: () => void;
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
}

export default function SubscriptionSection({ onBack }: SubscriptionSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('great-value');
  const router = useRouter();
  const { dictionary } = useLocale();

  const plans: Plan[] = useMemo(() => [
    {
      id: 'flexible',
      name: dictionary.subscription.plans.flexible,
      discount: '35% OFF',
      originalPrice: '$19.99',
      price: '$12.99/month',
      amount: 12.99,
      billing: dictionary.subscription.billing.monthly,
      savings: '-',
      popular: false,
      icon: <Zap className="w-6 h-6" />,
      color: 'blue',
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-cyan-500/20',
    },
    {
      id: 'great-value',
      name: dictionary.subscription.plans.greatValue,
      discount: '50% OFF',
      originalPrice: '$19.99',
      price: '$9.99/month',
      amount: 9.99,
      billing: dictionary.subscription.billing.quarterly,
      savings: dictionary.subscription.savings.quarterly,
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      color: 'pink',
      gradientFrom: 'from-pink-500/20',
      gradientTo: 'to-purple-500/20',
    },
    {
      id: 'ultimate',
      name: dictionary.subscription.plans.ultimate,
      discount: '70% OFF',
      originalPrice: '$19.99',
      price: '$5.99/month',
      amount: 5.99,
      billing: dictionary.subscription.billing.annually,
      savings: dictionary.subscription.savings.annually,
      popular: false,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'purple',
      gradientFrom: 'from-purple-500/20',
      gradientTo: 'to-indigo-500/20',
    },
  ], [dictionary.subscription]);

  const features = useMemo(() => [
    { icon: '🤖', text: dictionary.subscription.features.createAI },
    { icon: '💬', text: dictionary.subscription.features.unlimitedText },
    { icon: '🎁', text: dictionary.subscription.features.bonusTokens },
    { icon: '🖼️', text: dictionary.subscription.features.removeBlur },
    { icon: '🎨', text: dictionary.subscription.features.generateImages },
    { icon: '📞', text: dictionary.subscription.features.phoneCalls },
    { icon: '⚡', text: dictionary.subscription.features.fastResponse },
  ], [dictionary.subscription.features]);

  const benefits = useMemo(() => [
    {
      icon: Shield,
      title: dictionary.subscription.benefits.privacyFirst,
      description: dictionary.subscription.benefits.privacyDesc,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: Zap,
      title: dictionary.subscription.benefits.transparentPricing,
      description: dictionary.subscription.benefits.transparentDesc,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Gift,
      title: dictionary.subscription.benefits.fullControl,
      description: dictionary.subscription.benefits.fullControlDesc,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Star,
      title: dictionary.subscription.benefits.limitedOffer,
      description: dictionary.subscription.benefits.limitedOfferDesc,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ], [dictionary.subscription.benefits]);

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen">
      {/* Back Button Header */}
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
              {dictionary.subscription.subscription}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-pink-300">{dictionary.subscription.limitedTimeOffer}</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            {dictionary.subscription.unlockPremiumAI}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {dictionary.subscription.saveUpTo70}
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-800/50 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            {dictionary.subscription.everythingIncluded}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-zinc-300 font-medium">{feature.text}</span>
                <Check size={16} className="text-emerald-400 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                selectedPlan === plan.id ? 'scale-105' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Glassmorphism Card */}
              <div className={`
                relative p-6 rounded-2xl backdrop-blur-xl transition-all duration-500
                ${selectedPlan === plan.id
                ? `bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} border-2 border-${plan.color}-500/50 shadow-2xl shadow-${plan.color}-500/20`
                : 'bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700/50'
              }
              `}>

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold shadow-lg">
                      <Crown className="w-3 h-3" />
                      {dictionary.subscription.mostPopular}
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} flex items-center justify-center mb-4 border border-${plan.color}-500/30`}>
                  <div className={`text-${plan.color}-400`}>
                    {plan.icon}
                  </div>
                </div>

                {/* Plan Details */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-zinc-400 line-through">{plan.originalPrice}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-1">{plan.billing}</p>
                  {plan.savings !== '-' && (
                    <p className="text-sm text-emerald-400 font-medium">{plan.savings}</p>
                  )}
                  <div className="inline-block px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mt-2">
                    <span className="text-xs font-bold text-amber-300">{plan.discount}</span>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${selectedPlan === plan.id
                  ? `border-${plan.color}-500 bg-${plan.color}-500 shadow-lg shadow-${plan.color}-500/50`
                  : 'border-zinc-600 bg-transparent'
                }
                `}>
                  {selectedPlan === plan.id && <Check size={14} className="text-white" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}

        {/* Benefits Grid */}
        {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">*/}
        {/*  {benefits.map((benefit, index) => (*/}
        {/*    <div key={index} className={`*/}
        {/*      p-4 rounded-xl backdrop-blur-xl border transition-all duration-300 hover:scale-105*/}
        {/*      ${benefit.bgColor} ${benefit.borderColor}*/}
        {/*    `}>*/}
        {/*      <div className={`w-10 h-10 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-3 border ${benefit.borderColor}`}>*/}
        {/*        <benefit.icon size={20} className={benefit.color} />*/}
        {/*      </div>*/}
        {/*      <h4 className="font-bold text-white mb-2">{benefit.title}</h4>*/}
        {/*      <p className="text-sm text-zinc-400">{benefit.description}</p>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* Action Section */}
        {selectedPlan && selectedPlanData && (
          <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{dictionary.subscription.readyToStart}</h3>
              <p className="text-zinc-400">
                {dictionary.subscription.youSelected} <span className="text-white font-semibold">{selectedPlanData.name}</span> {dictionary.subscription.plan}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-2xl font-bold text-white">{selectedPlanData.price}</span>
                <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                  {selectedPlanData.discount}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center max-w-md mx-auto">
              {/* Uncomment when ready */}
              {/* <StripeCheckoutButton amount={selectedPlanData.amount} /> */}

              <div className="relative flex items-center w-full justify-center">
                <hr className="flex-grow border-t border-zinc-700/50" />
                <span className="text-zinc-500 text-sm mx-4 bg-zinc-800/50 px-3 py-1 rounded-full">{dictionary.subscription.or}</span>
                <hr className="flex-grow border-t border-zinc-700/50" />
              </div>

              {/* <WalletConnect amount={selectedPlanData.amount} isCanPay={true} /> */}
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-zinc-500">
                {dictionary.subscription.securePayment}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}