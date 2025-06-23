'use client';

import React, { useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Wallet,
    Loader2,
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    Check,
    Sparkles,
    Send,
    ArrowRight
} from 'lucide-react';
import { z } from 'zod';
import SocialAuth from "@/components/auth/social-auth";
import { useModalStore } from '@/lib/stores/modalStore';
import { motion, AnimatePresence } from 'framer-motion';
import useWindowSize from '@/lib/hooks/useWindowSize';

// Schema для валидации с помощью zod
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
    onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
    const { login } = useAuthStore();
    const { isMobile } = useWindowSize()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState<Partial<LoginFormValues>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const { closeModal } = useModalStore((state) => state);

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
            await login(formData.email, formData.password);
            closeModal();
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`w-full mx-auto ${isMobile && 'h-full'}`}
      >
        <div
          className={
            isMobile
              ? 'h-full w-full flex flex-col items-center justify-center'
              : ''
          }
        >
          {/* Header */}
          <div
            className={`relative p-6 pb-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 ${isMobile && 'w-full'}`}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/25">
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-zinc-400">Sign in to continue your journey</p>
            </div>
          </div>

          <div className={`p-6 pt-6 pb-0 ${isMobile && 'w-full'}`}>
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
                >
                  <AlertCircle
                    size={18}
                    className="text-red-400 flex-shrink-0"
                  />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {formFields.map((field, index) => {
                const validation = getFieldValidation(field.id);
                const hasError =
                  formErrors[field.id as keyof typeof formErrors] ||
                  validation.isValid === false;
                const isValid = validation.isValid === true;
                const isFocused = focusedField === field.id;

                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor={field.id}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        isFocused ? 'text-pink-400' : 'text-zinc-300'
                      }`}
                    >
                      <field.icon size={16} />
                      <span>{field.label}</span>
                    </Label>

                    <div className="relative">
                      <Input
                        id={field.id}
                        type={
                          field.type === 'password' && !showPassword
                            ? 'password'
                            : 'text'
                        }
                        placeholder={field.placeholder}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        onFocus={() => handleFieldFocus(field.id)}
                        onBlur={() => handleFieldBlur(field.id)}
                        required
                        disabled={isLoading}
                        className={`
                        pl-4 pr-12 py-3 bg-zinc-700/50 backdrop-blur-sm border transition-all duration-200
                        focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          hasError
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
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      )}

                      {/* Validation icon */}
                      {!field.showToggle && validation.isValid !== null && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                            {formErrors[field.id as keyof typeof formErrors] ||
                              validation.message}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Forgot Password */}
              {/*<div className="text-right">*/}
              {/*    <button*/}
              {/*      type="button"*/}
              {/*      className="text-sm text-pink-400 hover:text-pink-300 transition-colors"*/}
              {/*      onClick={() => /!* Handle forgot password *!/}*/}
              {/*    >*/}
              {/*        Forgot password?*/}
              {/*    </button>*/}
              {/*</div>*/}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Social Auth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SocialAuth isLoading={isLoading} setErrors={setFormErrors} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
}