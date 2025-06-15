'use client';

import { Lock, X, CreditCard, Bitcoin } from 'lucide-react';

export default function SubscriptionPopup({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-zinc-900 rounded-2xl w-[90%] max-w-md overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-zinc-800">
          <h2 className="text-xl font-bold">Unlock Premium Content</h2>
          <button onClick={onClose} className="text-zinc-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-zinc-300">
              Subscribe to unlock unlimited NSFW content and premium features
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between border-2 border-pink-500">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold">Basic</h3>
                  <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                    POPULAR
                  </span>
                </div>
                <p className="text-sm text-zinc-400">10.5k Credits</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">$9.99</span>
                <p className="text-xs text-zinc-400">per month</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Standard</h3>
                <p className="text-sm text-zinc-400">21.0k Credits</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">$19.99</span>
                <p className="text-xs text-zinc-400">per month</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Premium</h3>
                <p className="text-sm text-zinc-400">31.5k Credits</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">$29.99</span>
                <p className="text-xs text-zinc-400">per month</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full bg-pink-500 text-white py-3 rounded-full font-medium flex items-center justify-center">
              <CreditCard size={18} className="mr-2" /> Pay with Card
            </button>
            <button className="w-full bg-zinc-700 text-white py-3 rounded-full font-medium flex items-center justify-center">
              <Bitcoin size={18} className="mr-2" /> Pay with Crypto
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-zinc-400 flex items-center justify-center">
            <Lock size={14} className="mr-1 text-pink-500" />
            <span>Secure payment • </span>
            <span className="text-pink-500 ml-1">Privacy guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
