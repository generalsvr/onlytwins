'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import useWindowSize from '@/lib/hooks/useWindowSize';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
}

export default function AuthModal({
  initialMode = 'login',
  onClose,
}: AuthModalProps) {
  const { isMobile } = useWindowSize();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { platform } = useAuth();
  return (
    <div className={'h-full'} >
      <div
        className={` ${isMobile ? 'w-full' : 'min-w-[420px]'}  h-full `}
      >
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
    </div>
  );
}
