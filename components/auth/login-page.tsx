'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { motion } from 'framer-motion';
import { Wallet, BellIcon as BrandTelegram, ArrowRight } from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Schema для валидации с помощью zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<LoginFormValues>>({});
  const [mode, setMode] = useState<'login' | 'signup' | 'wallet' | 'telegram'>('login');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});
    setIsLoading(true);

    // Валидация формы с помощью zod
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      // Если валидация не прошла, устанавливаем ошибки
      const errors: Partial<LoginFormValues> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') errors.email = err.message;
        if (err.path[0] === 'password') errors.password = err.message;
      });
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password).then(res => {
        router.push('/profile');
      });
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);

    }
  };

  const handleWalletLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // In a real app, this would connect to MetaMask or another wallet
      const mockAddress = '0x1234...5678';
      // await loginWithWallet(mockAddress);
    } catch (err) {
      setError('Wallet connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // In a real app, this would use the Telegram Login Widget
      const mockTelegramData = {
        id: '12345678',
        first_name: 'Demo',
        username: 'demo_user',
      };
      // await loginWithTelegram(mockTelegramData);
    } catch (err) {
      setError('Telegram login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <SafeImage
                    src="/app-icon.png"
                    alt="OnlyTwins Logo"
                    fill
                    className="object-contain"
                    fallbackSrc="/placeholder.svg?key=vx8rq"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2">OnlyTwins</h1>
            <p className="text-zinc-400 text-center mb-8">
              Connect with AI companions
            </p>

            {error && (
                <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4">
                  {error}
                </div>
            )}

            {mode === 'login' && (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                  <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-400 mb-1"
                    >
                      Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                            formErrors.email ? 'focus:ring-red-500' : 'focus:ring-pink-500'
                        }`}
                        placeholder="your@email.com"
                    />
                    {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-zinc-400 mb-1"
                    >
                      Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${
                            formErrors.password ? 'focus:ring-red-500' : 'focus:ring-pink-500'
                        }`}
                        placeholder="••••••••"
                    />
                    {formErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                    )}
                  </div>
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg py-3 font-medium flex items-center justify-center"
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                    {!isLoading && <ArrowRight size={18} className="ml-2" />}
                  </button>
                  <p className="text-center text-zinc-400 text-sm">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-pink-500 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </motion.form>
            )}

            {/* Alternative login methods */}
            {(mode === 'login' || mode === 'signup') && (
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <span className="px-4 text-zinc-500 text-sm">
                  or continue with
                </span>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <button
                        onClick={handleWalletLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-zinc-800 rounded-lg py-3 px-4 hover:bg-zinc-700 transition"
                    >
                      <Wallet size={18} className="mr-2" />
                      <span>Wallet</span>
                    </button>
                    <button
                        onClick={handleTelegramLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-blue-600 rounded-lg py-3 px-4 hover:bg-blue-700 transition"
                    >
                      <BrandTelegram size={18} className="mr-2" />
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}