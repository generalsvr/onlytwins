'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError } from '@/lib/types/auth';
import SocialAuth from '@/components/auth/social-auth';
import Cookies from 'js-cookie';

// Define the validation schema for signup form
const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  repeatPassword: z.string(),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  referralCode: z
    .string()
    .regex(/^[A-Za-z0-9]{6,12}$/, {
      message: 'Referral code must be 6-12 alphanumeric characters',
    })
    .optional(),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

interface SignupFormProps {
  onClose: () => void;
}

export default function SignupForm({ onClose }: SignupFormProps) {
  const { signup, platform } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isReferralDisabled, setIsReferralDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    repeatPassword?: string;
    firstName?: string;
    lastName?: string;
    referralCode?: string;
    server?: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle referral code from URL or cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const refFromUrl = searchParams.get('ref');
      const refFromCookie = Cookies.get('referral_code');

      if (refFromUrl) {
        setReferralCode(refFromUrl);
        setIsReferralDisabled(true);
      } else if (refFromCookie) {
        setReferralCode(refFromCookie);
        setIsReferralDisabled(true);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signupSchema.safeParse({
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
      referralCode: referralCode || undefined,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        repeatPassword: fieldErrors.repeatPassword?.[0],
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        referralCode: fieldErrors.referralCode?.[0],
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, firstName, lastName);
      if (referralCode && typeof window !== 'undefined') {
        Cookies.set('referral_code', referralCode, { expires: 60 });
      }
      onClose();
      router.push('/profile');
    } catch (err) {
      const error = err as AuthError;
      let errorMessage = 'Failed to create account. Please try again.';

      if (error.status === 422 && error.type === 'validation_error') {
        errorMessage = 'Invalid input data.';
        const details = error.details || [];
        const newErrors: typeof errors = {};
        details.forEach((detail) => {
          const field = detail.loc[detail.loc.length - 1];
          if (field === 'email') newErrors.email = detail.msg;
          if (field === 'password') newErrors.password = detail.msg;
          if (field === 'first_name') newErrors.firstName = detail.msg;
          if (field === 'last_name') newErrors.lastName = detail.msg;
        });
        setErrors(newErrors);
      } else if (error.status === 409) {
        errorMessage = 'This email is already registered.';
        setErrors({ email: errorMessage });
      } else if (error.status === 400 && error.message.includes('referral')) {
        errorMessage = 'Invalid referral code provided.';
        setErrors({ referralCode: errorMessage });
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
      <div className="text-center p-4">
        <p className="text-zinc-400">
          Authentication is handled through Telegram on mobile devices.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={`bg-zinc-800 border-zinc-700 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className={`bg-zinc-800 border-zinc-700 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="repeatPassword">Repeat Password</Label>
          <Input
            id="repeatPassword"
            type="password"
            placeholder="Repeat your password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            disabled={isLoading}
            className={`bg-zinc-800 border-zinc-700 ${errors.repeatPassword ? 'border-red-500' : ''}`}
          />
          {errors.repeatPassword && (
            <p className="text-red-500 text-sm">{errors.repeatPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={isLoading}
            className={`bg-zinc-800 border-zinc-700 ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            disabled={isLoading}
            className={`bg-zinc-800 border-zinc-700 ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral Code (Optional)</Label>
          <Input
            id="referralCode"
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={isLoading || isReferralDisabled}
            className={`bg-zinc-800 border-zinc-700 ${errors.referralCode ? 'border-red-500' : ''}`}
          />
          {errors.referralCode && (
            <p className="text-red-500 text-sm">{errors.referralCode}</p>
          )}
        </div>

        {errors.server && (
          <p className="text-red-500 text-sm">{errors.server}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Continue
        </Button>
      </form>

      <SocialAuth isLoading={isLoading} setErrors={setErrors} />
    </div>
  );
}