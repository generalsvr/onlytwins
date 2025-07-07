import React from 'react';
import TelegramButton from '@/components/telegram-button';
import { useLocale } from '@/contexts/LanguageContext';

interface CustomTelegramButtonProps {
  botName: string;
  onAuth: (user: any) => void;
  className?: string;
}

export function CustomTelegramButton({
  botName,
  onAuth,
  className,
}: CustomTelegramButtonProps) {
  const { locale } = useLocale();
  const handleLogin = () => {
    const returnUrl = `${window.location.origin}/${locale}/auth/callback`;
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent(returnUrl)}`;

    window.location.href = authUrl;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://oauth.telegram.org') return;

      if (event.data.type === 'auth_result') {
        onAuth(event.data.user);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return <TelegramButton onClick={handleLogin} />;
}
