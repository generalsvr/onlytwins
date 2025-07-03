'use client'

import { useEffect, useState } from 'react';
import { TelegramAuthRequest } from '@/lib/types/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { TelegramAuthData } from '@/components/telegram-login';
import { Loader } from '@/components/ui/loader';

export default function TelegramAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Обработка авторизации...');
  const router = useRouter();
  const { telegramAuth } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Проверяем hash-параметры
        const hash = window.location.hash;

        if (!hash.includes('tgAuthResult=')) {
          setStatus('error');
          setMessage('Данные авторизации не найдены');
          router.push('/');
          return;
        }

        const tgAuthResult = hash.split('tgAuthResult=')[1];
        console.log(tgAuthResult)
        const parsedHash = JSON.parse(atob(tgAuthResult)) as TelegramAuthData
        console.log(parsedHash)
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
          if (parsedHash[field] !== undefined && parsedHash[field] !== null) {
            dataParams.push(`${field}=${encodeURIComponent(parsedHash[field])}`);
          }
        }

        // Add hash to the query string
        dataParams.push(`hash=${parsedHash.hash}`);

        // Create URL-encoded initData string
        const initDataString = dataParams.sort().join('&');

        const telegramAuthData = {
          initData: initDataString,
          id: parsedHash.id,
          firstName: parsedHash.first_name,
          lastName: parsedHash.last_name || null,
          username: parsedHash.username || null,
          photoUrl: parsedHash.photo_url || null,
          authDate: parsedHash.auth_date,
          hash: parsedHash.hash,
        };

        await telegramAuth(telegramAuthData as TelegramAuthRequest).then(() => {
          router.push('/profile');
        });




      } catch (error) {
        router.push('/');
        console.error('Ошибка авторизации:', error);
        setStatus('error');
        setMessage('Произошла ошибка при авторизации');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen min-w-screen bg-black z-9999">
      <Loader/>
    </div>
  );
}
