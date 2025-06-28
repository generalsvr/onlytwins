'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  X
} from 'lucide-react';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface ErrorPopupProps {
  error: {
    title?: string;
    message: string;
    code?: string;
    timestamp?: string;
    details?: string;
  };
  onClose: () => void;
  onRetry?: () => void;
}

export default function ErrorPopup({
  error,
  onClose
}: ErrorPopupProps) {
  const {isMobile} = useWindowSize();
  return (
    <AnimatePresence>
      {/* Modal */}
      <div className={`w-full max-w-md mx-auto ${isMobile && 'h-full flex justify-center items-center'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-zinc-800/50">
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-red-500/30"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 8px rgba(239, 68, 68, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </motion.div>
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Something went wrong
              </h2>

              <div className="text-center space-y-2">
                <p className="text-zinc-400 leading-relaxed">{error.message}</p>
              </div>


            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
