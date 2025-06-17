'use client';

import React, { useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Check,
  Sparkles,
  Shield,
  Zap,
  Send
} from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Schema для валидации с помощью zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<LoginFormValues>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear general error
    if (error) {
      setError('');
    }
  }, [formErrors, error]);

  const handleFieldFocus = useCallback((field: string) => {
    setFocusedField(field);
  }, []);

  const handleFieldBlur = useCallback((field: string) => {
    setFocusedField(null);
    setTouchedFields(prev => new Set([...prev, field]));
  }, []);

  // Real-time validation
  const getFieldValidation = useCallback((field: string) => {
    if (!touchedFields.has(field)) return { isValid: null, message: '' };

    try {
      const fieldSchema = loginSchema.shape[field as keyof typeof loginSchema.shape];
      fieldSchema.parse(formData[field as keyof typeof formData]);
      return { isValid: true, message: '' };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, message: error.errors[0]?.message || '' };
      }
      return { isValid: false, message: '' };
    }
  }, [touchedFields, formData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});
    setIsLoading(true);

    // Валидация формы с помощью zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
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
      await login(formData.email, formData.password).then(() => {
        router.push('/profile');
      });
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Mock wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would connect to MetaMask or another wallet
      throw new Error('Wallet connection not implemented');
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
      // Mock telegram login
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would use the Telegram Login Widget
      throw new Error('Telegram login not implemented');
    } catch (err) {
      setError('Telegram login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      icon: Mail,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      icon: Lock,
      showToggle: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-2xl shadow-pink-500/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={40} className="text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
              OnlyTwins
            </h1>
            <p className="text-zinc-400 text-lg">
              Welcome back! Sign in to continue
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3"
              >
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/30 shadow-2xl"
          >
            <form onSubmit={handleLogin} className="space-y-6">
              {formFields.map((field, index) => {
                const validation = getFieldValidation(field.id);
                const hasError = formErrors[field.id as keyof typeof formErrors] || (validation.isValid === false);
                const isValid = validation.isValid === true;
                const isFocused = focusedField === field.id;

                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor={field.id}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        isFocused ? 'text-pink-400' : 'text-zinc-300'
                      }`}
                    >
                      <field.icon size={16} />
                      <span>{field.label}</span>
                    </label>

                    <div className="relative">
                      <input
                        id={field.id}
                        type={field.type === 'password' && !showPassword ? 'password' : 'text'}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        onFocus={() => handleFieldFocus(field.id)}
                        onBlur={() => handleFieldBlur(field.id)}
                        placeholder={field.placeholder}
                        disabled={isLoading}
                        className={`
                          w-full px-4 py-4 pr-12 bg-zinc-700/50 backdrop-blur-sm rounded-xl border transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${hasError
                          ? 'border-red-500/50 bg-red-500/5'
                          : isValid
                            ? 'border-green-500/50 bg-green-500/5'
                            : isFocused
                              ? 'border-pink-500/50 bg-zinc-700/70'
                              : 'border-zinc-600/50 hover:border-zinc-500/50'
                        }
                        `}
                      />

                      {/* Password toggle */}
                      {field.showToggle && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      )}

                      {/* Validation icon */}
                      {!field.showToggle && validation.isValid !== null && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          {validation.isValid ? (
                            <Check size={18} className="text-green-500" />
                          ) : (
                            <AlertCircle size={18} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Field Error */}
                    <AnimatePresence>
                      {hasError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center space-x-2 text-red-400 text-sm"
                        >
                          <AlertCircle size={14} />
                          <span>
                            {formErrors[field.id as keyof typeof formErrors] || validation.message}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                  onClick={() => {/* Handle forgot password */}}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-zinc-700/50" />
              <span className="px-4 text-zinc-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-zinc-700/50" />
            </div>

            {/* Alternative Login Methods */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleWalletLogin}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-xl py-3 px-4 transition-all duration-200 border border-zinc-600/30 hover:border-zinc-500/50 disabled:opacity-50"
              >
                <Wallet size={18} className="text-zinc-300" />
                <span className="text-zinc-300 font-medium">Wallet</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleTelegramLogin}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-blue-600/80 hover:bg-blue-600 rounded-xl py-3 px-4 transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50 disabled:opacity-50"
              >
                <Send size={18} className="text-white" />
                <span className="text-white font-medium">Telegram</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                Create one now
              </button>
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Sparkles, label: 'Premium' },
            ].map((feature, index) => (
              <div key={feature.label} className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                  <feature.icon size={18} className="text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-500">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}