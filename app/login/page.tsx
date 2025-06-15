'use client';
import React, { useState, useEffect } from 'react';
import FullScreenFeed from '@/components/full-screen-feed';
import SafeImage from '@/components/safe-image';
import Heart from '@/components/heart';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/lib/stores/modalStore';
import AuthModal from '@/components/auth/auth-modal';
import { CHARACTERS } from '@/lib/consts';
import { TelegramLoginButton } from '@/components/telegram-login';
import LoginPage from '@/components/auth/login-form';

interface FeedPageProps {}

// Mock data for characters with multiple images and videos

export default function Login({}: FeedPageProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [isPlayVideo, setIsPlayVideo] = useState<number | null>(null);
  const router = useRouter();

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="relative h-screen w-full">
      <LoginPage />
    </div>
  );
}
