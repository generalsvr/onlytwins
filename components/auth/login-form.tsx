'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, BellIcon as BrandTelegram, Loader2 } from 'lucide-react';
import SafeImage from '@/components/safe-image';
import { z } from 'zod';
import SocialAuth from "@/components/auth/social-auth";

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
            await login(email, password);
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
        <div className="flex flex-col bg-zinc-900 text-white">
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-4">
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
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
                                    className={`bg-zinc-800 border-zinc-700 ${formErrors.email ? 'border-red-500' : ''}`}
                                />
                                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
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
                                    className={`bg-zinc-800 border-zinc-700 ${formErrors.password ? 'border-red-500' : ''}`}
                                />
                                {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Login
                            </Button>
                        </form>
                    )}
                    <SocialAuth isLoading={isLoading} setErrors={setFormErrors}/>
                </div>
            </div>
        </div>
    );
}