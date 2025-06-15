'use client';

import { useState } from 'react';
import { X, CreditCard, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';

interface CreditDepletedModalProps {
  requiredCredits: number;
  onClose: () => void;
  onPurchase: () => void;
}

export default function CreditDepletedModal({
  requiredCredits,
  onClose,
  onPurchase,
}: CreditDepletedModalProps) {
  const { credits, platform } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(1);

  const creditPackages = [
    { id: 0, credits: 100, price: '$4.99' },
    { id: 1, credits: 300, price: '$9.99' },
    { id: 2, credits: 1000, price: '$24.99' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">Not Enough Credits</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center">
              <CreditCard size={32} className="text-pink-500" />
            </div>
          </div>

          <p className="text-center mb-6">
            You need{' '}
            <span className="text-pink-500 font-bold">{requiredCredits}</span>{' '}
            credits for this action, but you only have{' '}
            <span className="text-pink-500 font-bold">{credits}</span> credits.
          </p>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-center">
              Select a credit package:
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-zinc-800 rounded-xl p-3 flex flex-col items-center cursor-pointer border-2 ${
                    selectedPackage === pkg.id
                      ? 'border-pink-500'
                      : 'border-transparent'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center mb-2">
                    <Coins size={20} className="text-pink-400" />
                  </div>
                  <p className="font-semibold text-sm">{pkg.credits}</p>
                  <p className="text-xs text-zinc-400">{pkg.price}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onPurchase}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg py-3 font-medium"
          >
            Purchase Credits
          </button>

          {platform === 'telegram' && (
            <p className="text-xs text-center text-zinc-400 mt-4">
              Credits will be added to your Telegram account
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
