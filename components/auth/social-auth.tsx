'use client';
import { useRouter } from 'next/navigation';

import React from 'react';
import { Button } from '@/components/ui/button';
import { NextRouter } from 'next/router';
import {
  TelegramAuthData,
  TelegramLoginButton,
} from '@/components/telegram-login';
import { useAuthStore } from '@/lib/stores/authStore';
import { TelegramAuthRequest } from '@/lib/types/auth';
import { useModalStore } from '@/lib/stores/modalStore';
import GoogleButton from '@/components/google-button';
interface SocialAuthProps {
  isLoading: boolean;
  setErrors: React.Dispatch<
    React.SetStateAction<{ email?: string; password?: string; server?: string }>
  >;
}

export default function SocialAuth({ isLoading, setErrors }: SocialAuthProps) {
  const router = useRouter();
  const { telegramAuth, platform } = useAuthStore();
  const closeModal = useModalStore((state) => state.closeModal);
  const handleGoogleSignup = () => {
    try {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_HOST_URL}/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        state:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        access_type: 'offline',
        prompt: 'consent',
      });
      window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
    } catch (error) {
      console.error('Google signup redirect error:', error);
      setErrors({ server: 'Failed to initiate Google signup.' });
    }
  };

  const handleTwitterSignup = () => {
    try {
      router.push('/api/auth/x/authorize');
    } catch (error) {
      console.error('Twitter signup redirect error:', error);
      setErrors({ server: 'Failed to initiate Twitter signup.' });
    }
  };
  const processTelegramAuth = async (data: TelegramAuthData) => {
    try {
      // Create URL-encoded query string for initData (matching Telegram's format)
      const dataParams = [];
      const fields = [
        'auth_date',
        'first_name',
        'id',
        'last_name',
        'photo_url',
        'username',
      ];

      for (const field of fields) {
        if (data[field] !== undefined && data[field] !== null) {
          dataParams.push(`${field}=${encodeURIComponent(data[field])}`);
        }
      }

      // Add hash to the query string
      dataParams.push(`hash=${data.hash}`);

      // Create URL-encoded initData string
      const initDataString = dataParams.sort().join('&');

      // Prepare Telegram auth data
      const telegramAuthData = {
        initData: initDataString,
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name || null,
        username: data.username || null,
        photoUrl: data.photo_url || null,
        authDate: data.auth_date,
        hash: data.hash,
      };

      await telegramAuth(telegramAuthData).then(() => {
        closeModal();
        router.push('/profile');
      });
    } catch (err: any) {
      console.error('Telegram auth processing error:', err);
    }
  };

  return (
    <>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-zinc-400">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        {/*<Button*/}
        {/*  variant="outline"*/}
        {/*  onClick={handleGoogleSignup}*/}
        {/*  disabled={isLoading}*/}
        {/*  className="border-zinc-700 hover:bg-zinc-800 flex items-center justify-center w-full"*/}
        {/*>*/}
        {/*  <svg*/}
        {/*    xmlns="http://www.w3.org/2000/svg"*/}
        {/*    viewBox="0 0 48 48"*/}
        {/*    width="48px"*/}
        {/*    height="48px"*/}
        {/*  >*/}
        {/*    <path*/}
        {/*      fill="white"*/}
        {/*      d="M44.5,20H24v8.5h11.8C34.2,33.4,29.7,36,24,36c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.9,1.2,8,3.1l6.4-6.4C34.4,5.5,29.5,3,24,3C12.9,3,4,11.9,4,23s8.9,20,20,20c10.1,0,19.2-7.3,19.2-20C43.2,22.7,43,21.3,42.7,20H44.5z"*/}
        {/*    />*/}
        {/*  </svg>*/}
        {/*</Button>*/}
        <div className={'max-w-max h-full flex items-start gap-2'}>
          <TelegramLoginButton
            onAuthCallback={(data) => processTelegramAuth(data)}
            botUsername={'onlytwins_chat_bot'}
            buttonSize="large" // "large" | "medium" | "small"
            cornerRadius={5} // 0 - 20
            showAvatar={false} // true | false
            lang="en"
          />
          <GoogleButton onClick={handleGoogleSignup}>Google</GoogleButton>
        </div>
        {/*<Button*/}
        {/*  variant="outline"*/}
        {/*  onClick={handleTwitterSignup}*/}
        {/*  disabled={isLoading}*/}
        {/*  className="border-zinc-700 hover:bg-zinc-800 flex items-center justify-center w-full"*/}
        {/*>*/}
        {/*  <svg viewBox="0 0 24 24" aria-hidden="true" fill="white">*/}
        {/*    <g>*/}
        {/*      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>*/}
        {/*    </g>*/}
        {/*  </svg>*/}
        {/*</Button>*/}
      </div>
    </>
  );
}
