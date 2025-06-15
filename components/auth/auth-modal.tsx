'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import LoginForm from './login-form';
import SignupForm from './signup-form';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({
  initialMode = 'login',
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { platform } = useAuth();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm onClose={onClose} />
                <div className="mt-6 text-center text-zinc-400 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-pink-500 hover:text-pink-400 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <SignupForm onClose={onClose} />
                <div className="mt-6 text-center text-zinc-400 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-pink-500 hover:text-pink-400 font-medium"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
