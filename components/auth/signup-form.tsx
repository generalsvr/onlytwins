'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Mail,
  Lock,
  Sparkles,
} from 'lucide-react';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError } from '@/lib/types/auth';
import SocialAuth from '@/components/auth/social-auth';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/contexts/LanguageContext';

interface SignupFormProps {
  onClose: () => void;
}

export default function SignupForm({ onClose }: SignupFormProps) {
  const { signup, platform } = useAuthStore();
  const { dictionary, locale } = useLocale();

  // Create localized validation schema
  const signupSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .email({ message: dictionary.auth.signup.errors.emailRequired }),
        password: z
          .string()
          .min(8, { message: dictionary.auth.signup.errors.passwordMin })
          .regex(/[A-Z]/, {
            message: dictionary.auth.signup.errors.passwordUppercase,
          })
          .regex(/[a-z]/, {
            message: dictionary.auth.signup.errors.passwordLowercase,
          })
          .regex(/[0-9]/, {
            message: dictionary.auth.signup.errors.passwordNumber,
          })
      }),
    [locale]
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    referralCode: '', // Скрытое поле для логики
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    server?: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle referral code from URL or cookies (скрытая логика)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const refFromUrl = searchParams.get('ref');
      const refFromCookie = Cookies.get('referral_code');

      if (refFromUrl) {
        setFormData((prev) => ({ ...prev, referralCode: refFromUrl }));
      } else if (refFromCookie) {
        setFormData((prev) => ({ ...prev, referralCode: refFromCookie }));
      }
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleFieldBlur = (field: string) => {
    setFocusedField(null);
    setTouchedFields((prev) => new Set([...prev, field]));
  };

  // Real-time validation for better UX
  const getFieldValidation = (field: string) => {
    if (!touchedFields.has(field)) return { isValid: null, message: '' };

    try {
      const fieldSchema =
        signupSchema.shape[field as keyof typeof signupSchema.shape];
      fieldSchema.parse(formData[field as keyof typeof formData]);
      return { isValid: true, message: '' };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, message: error.errors[0]?.message || '' };
      }
      return { isValid: false, message: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signupSchema.safeParse({
      ...formData,
      referralCode: formData.referralCode || undefined,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setIsLoading(true);

    try {
      // Используем пустые строки для firstName и lastName, так как они больше не собираются в форме
      await signup(
        formData.email,
        formData.password,
        '',
        '',
        formData.referralCode ? formData.referralCode : undefined
      );

      // Сохраняем referral code если он есть
      if (formData.referralCode && typeof window !== 'undefined') {
        Cookies.set('referral_code', formData.referralCode, { expires: 60 });
      }

      onClose();
      router.push('/profile');
    } catch (err) {
      const error = err as AuthError;
      let errorMessage = dictionary.auth.signup.errors.createAccountFailed;

      if (error.status === 422 && error.type === 'validation_error') {
        errorMessage = dictionary.auth.signup.errors.invalidInputData;
        const details = error.details || [];
        const newErrors: typeof errors = {};
        details.forEach((detail) => {
          const field = detail.loc[detail.loc.length - 1];
          if (field === 'email') newErrors.email = detail.msg;
          if (field === 'password') newErrors.password = detail.msg;
        });
        setErrors(newErrors);
      } else if (error.status === 409) {
        errorMessage = dictionary.auth.signup.errors.emailAlreadyRegistered;
        setErrors({ email: errorMessage });
      } else if (error.status === 400 && error.message.includes('referral')) {
        errorMessage = dictionary.auth.signup.errors.invalidReferralCode;
        // Для referral code ошибки показываем как server error, так как поле скрыто
        setErrors({ server: errorMessage });
      } else {
        console.error('Signup error:', error);
      }

      setErrors((prev) => ({ ...prev, server: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  if (platform === 'telegram') {
    return (
      <div className="text-center p-6 bg-zinc-800/40 backdrop-blur-sm rounded-2xl border border-zinc-700/30">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-blue-400" />
        </div>
        <p className="text-zinc-300 text-lg font-medium mb-2">
          {dictionary.auth.signup.telegramAuth}
        </p>
        <p className="text-zinc-400">
          {dictionary.auth.signup.telegramAuthDesc}
        </p>
      </div>
    );
  }

  const formFields = useMemo(
    () => [
      {
        id: 'email',
        label: dictionary.auth.signup.email,
        type: 'email',
        placeholder: dictionary.auth.signup.enterEmail,
        icon: Mail,
        required: true,
      },
      {
        id: 'password',
        label: dictionary.auth.signup.password,
        type: 'password',
        placeholder: dictionary.auth.signup.enterPassword,
        icon: Lock,
        required: true,
        showToggle: true,
      },
    ],
    [dictionary.auth.signup]
  );

  return (
    <div className="p-6 pb-0">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/25">
          <Sparkles size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {dictionary.auth.signup.createAccount}
        </h2>
        <p className="text-zinc-400">{dictionary.auth.signup.joinCommunity}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {formFields.map((field, index) => {
          const validation = getFieldValidation(field.id);
          const hasError =
            errors[field.id as keyof typeof errors] ||
            (validation.isValid === false && validation.message);
          const isValid = validation.isValid === true;
          const isFocused = focusedField === field.id;
          const isPasswordField = field.type === 'password';

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <Label
                htmlFor={field.id}
                className={`flex items-center space-x-2 transition-colors ${
                  isFocused ? 'text-pink-400' : 'text-zinc-300'
                }`}
              >
                <field.icon size={16} />
                <span>{field.label}</span>
                {field.required && <span className="text-red-400">*</span>}
              </Label>

              <div className="relative">
                <Input
                  id={field.id}
                  type={isPasswordField && !showPassword ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  onFocus={() => handleFieldFocus(field.id)}
                  onBlur={() => handleFieldBlur(field.id)}
                  required={field.required}
                  disabled={isLoading}
                  className={`
                    pl-4 pr-12 py-3 bg-zinc-800/50 backdrop-blur-sm border transition-all duration-200
                    focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                    ${
                      hasError
                        ? 'border-red-500/50 bg-red-500/5'
                        : isValid
                          ? 'border-green-500/50 bg-green-500/5'
                          : isFocused
                            ? 'border-pink-500/50 bg-zinc-800/70'
                            : 'border-zinc-700/50 hover:border-zinc-600/50'
                    }
                  `}
                />

                {/* Password toggle */}
                {field.showToggle && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

              {/* Error message */}
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
                      {errors[field.id as keyof typeof errors] ||
                        validation.message}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {isValid && touchedFields.has(field.id) && !hasError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-2 text-green-400 text-sm"
                  >
                    <Check size={14} />
                    <span>{dictionary.auth.signup.looksGood}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Server error */}
        <AnimatePresence>
          {errors.server && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errors.server}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{dictionary.auth.signup.creatingAccount}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles size={20} />
                <span>{dictionary.auth.signup.createAccount}</span>
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
        <SocialAuth isLoading={isLoading} setErrors={setErrors} />
      </motion.div>
    </div>
  );
}
