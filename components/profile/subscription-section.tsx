'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Star, Zap, Shield, Gift } from 'lucide-react';
import StripeCheckoutButton from '@/components/stripe-buttons';
import WalletConnect from '@/components/payments/wallet-connect';

interface SubscriptionSectionProps {
  onBack: () => void;
}

export default function SubscriptionSection({
  onBack,
}: SubscriptionSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Subscription plans based on screenshot data
  const plans = [
    {
      id: 'flexible',
      name: '1 Month – Flexible Start',
      discount: '35% OFF',
      originalPrice: '$19.99',
      price: '$12.99/month',
      amount:12.99,
      billing: 'Billed Monthly',
      savings: '-',
      popular: false,
    },
    {
      id: 'great-value',
      name: '3 Months – Great Value',
      discount: '50% OFF',
      originalPrice: '$19.99',
      price: '$9.99/month',
      amount:9.99,
      billing: 'Billed $29.97 Quarterly',
      savings: 'Save $30 over 3 months',
      popular: true,
    },
    {
      id: 'ultimate',
      name: '12 Months – Ultimate Savings',
      discount: '70% OFF',
      originalPrice: '$19.99',
      price: '$5.99/month',
      amount:5.99,
      billing: 'Billed $71.88 Annually',
      savings: 'Save $168 over 12 months!',
      popular: false,
    },
  ];

  // Features are the same for all plans according to the screenshot
  const features = [
    'Create AI Companion(s)',
    'Unlimited Text Messages',
    'Bonus Tokens Monthly',
    'Remove Image Blur',
    'Generate AI Images',
    'Make AI Phone Calls',
    'Fast AI Response Time',
  ];

  return (
    <div>
      {/* Header */}
      <div className="pb-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Subscription</h1>
      </div>

      {/* Subscription Content */}
      <div className="">
        <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-zinc-400 mb-6">
          Unlock your premium AI experience & save big with up to 70% OFF your
          first subscription!
        </p>

        {/* Subscription Plans */}
        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
              <div
                  key={plan.id}
                  className={`bg-zinc-900 rounded-xl p-4 border ${
                      plan.popular ? 'border-pink-500' : 'border-zinc-800'
                  } relative cursor-pointer`}
                  onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                    <div
                        className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-tl-none rounded-tr-xl rounded-br-none rounded-bl-xl">
                      RECOMMENDED
                    </div>
                )}
                <div className="flex items-center mb-3">
                  <div
                      className={`w-5 h-5 rounded-full border-2 ${
                          selectedPlan === plan.id
                              ? 'border-pink-500 bg-pink-500'
                              : 'border-zinc-600 bg-transparent'
                      } mr-3 flex items-center justify-center`}
                  >
                    {selectedPlan === plan.id && (
                        <Check size={12} className="text-white"/>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
                <div className="pl-8 mb-2">
                  <p className="text-zinc-400 line-through">
                    {plan.originalPrice}
                  </p>
                  <p className="text-lg font-bold">{plan.price}</p>
                  <p className="text-zinc-400">{plan.billing}</p>
                  <p className="text-green-500 font-medium">{plan.savings}</p>
                  <p className="text-yellow-500 font-medium">{plan.discount}</p>
                </div>
                <div className="space-y-2 pl-8">
                  {features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check
                            size={16}
                            className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-zinc-300">{feature}</span>
                      </div>
                  ))}
                </div>
              </div>
          ))}
        </div>

        {/* Plan Features */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Additional Benefits</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                <Shield size={20} className="text-yellow-500"/>
              </div>
              <h4 className="font-medium mb-1">Your Privacy is Our Priority</h4>
              <p className="text-zinc-400 text-sm">
                Discrete billing: No adult or explicit platform names on your
                bank statement.
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                <Zap size={20} className="text-purple-500"/>
              </div>
              <h4 className="font-medium mb-1">Transparent Pricing</h4>
              <p className="text-zinc-400 text-sm">No hidden fees, ever.</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                <Gift size={20} className="text-blue-500"/>
              </div>
              <h4 className="font-medium mb-1">Full Control</h4>
              <p className="text-zinc-400 text-sm">
                Cancel your subscription anytime.
              </p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                <Star size={20} className="text-green-500"/>
              </div>
              <h4 className="font-medium mb-1">Limited-Time Offer</h4>
              <p className="text-zinc-400 text-sm">
                Up to 70% OFF your first subscription!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}

        {selectedPlan && (
            <div className="flex flex-col gap-4 items-center">
              {/*<StripeCheckoutButton amount={selectedPlan?.amount || 0}/>*/}
              <div className="relative flex items-center w-full max-w-xs justify-center">
                <hr className="flex-grow border-t border-gray-700 w-full bg-gray-700"/>
                <p className="text-gray-700 text-xs mx-4">OR</p>
                <hr className="flex-grow border-t border-gray-700 w-full"/>
              </div>
              {/*<WalletConnect*/}
              {/*    amount={selectedPlan?.amount || 0}*/}
              {/*    isCanPay={true}*/}
              {/*/>*/}
            </div>
        )}
      </div>
    </div>
  );
}
