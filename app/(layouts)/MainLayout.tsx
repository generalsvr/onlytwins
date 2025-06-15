'use client';

import React, { useEffect, useState } from 'react';
import '../globals.css';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { useAuthStore } from '@/lib/stores/authStore';
import A11ySkipLink from '@/components/a11y-skip-link';
import Header from '@/components/header';
import { usePathname, useSearchParams } from 'next/navigation';
import MainNavigation from '@/components/main-navigation';
import AuthModal from '@/components/auth/auth-modal';
import { useModalStore } from '@/lib/stores/modalStore';
import { setReferralCookie } from '@/lib/utils';
import FailedPayment from '@/components/modals/failed-payment';
import { Star, X } from 'lucide-react';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { useNotificationStore } from '@/lib/stores/notificationStore';
import Cookies from 'js-cookie';
import { authService } from '@/lib/services/v1/auth';
import { Loader } from '@/components/ui/loader';
import { AuthProvider } from '@/contexts/AuthContext';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    isAuthenticated,
    setUser,
    getCurrentUser,
    telegramAuth,
    setIsLoading,
  } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModalStore();
  const { isMobile } = useWindowSize();
  const [singUpPopupShow, setSingUpPopupShow] = useState(true);
  const { setToastNotification } = useNotificationStore();

  // // Парсинг Telegram initData
  // function parseQueryString(query: string) {
  //   const result: Record<string, any> = {};
  //   const pairs = query.split('&');
  //
  //   pairs.forEach((pair) => {
  //     const [key, value] = pair.split('=');
  //     const decodedKey = decodeURIComponent(key);
  //     let decodedValue = decodeURIComponent(value);
  //
  //     if (decodedValue.startsWith('{') && decodedValue.endsWith('}')) {
  //       try {
  //         decodedValue = JSON.parse(decodedValue);
  //       } catch (e) {
  //         console.error(`Ошибка парсинга JSON для ключа ${decodedKey}:`, e);
  //       }
  //     }
  //
  //     result[decodedKey] = decodedValue;
  //   });
  //
  //   return result;
  // }

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');
      console.log('access_token', accessToken);
      console.log('refresh_token', refreshToken);
      // if (isTMA()) {
      //   const initDataRaw = retrieveRawInitData();
      //   if (initDataRaw) {
      //     const data = parseQueryString(initDataRaw);
      //     const user = data.user || {};
      //     try {
      //       await telegramAuth({
      //         initData: initDataRaw,
      //         id: parseInt(user.id) || 0,
      //         firstName: user.first_name || '',
      //         lastName: user.last_name || '',
      //         username: user.username || '',
      //         photoUrl: user.photo_url || '',
      //         authDate: parseInt(data.auth_date) || 0,
      //         hash: data.hash || '',
      //       });
      //     } catch (error) {
      //       console.error('Telegram auth failed:', error);
      //       setUser(null);
      //     }
      //   }
      //   return;
      // }
      if (!accessToken && refreshToken) {
        try {
          await authService.refreshToken();
          await getCurrentUser();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (!accessToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        await getCurrentUser();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, getCurrentUser, telegramAuth]);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setToastNotification({
        id: 5,
        type: 'system',
        username: 'OnlyTwins',
        avatar: '/app-icon.png',
        content: 'Payment successfully',
        time: 'now',
        read: true,
      });
      // openModal({
      //   type: 'message',
      //   content: <SuccessPayment />,
      // });
    } else if (paymentStatus === 'failed') {
      openModal({
        type: 'message',
        content: <FailedPayment />,
      });
    }

    setReferralCookie();
  }, [searchParams, setToastNotification, openModal]);

  return (
    // <TonConnectUIProvider manifestUrl="https://onlytwins.jundev.tech/tonconnect-manifest.json">
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div
            className={
              isMobile
                ? `w-full h-full ${pathname.includes('chat') && 'overflow-hidden'}`
                : 'mx-auto max-w-[1440px] pt-6 px-4'
            }
          >
            <A11ySkipLink />
            <Header />
            <Loader />
            <div
              className={
                isMobile
                  ? `pt-2 ${!pathname.includes('chat') && 'pb-20'}`
                  : 'pt-12'
              }
            >
              {children}
            </div>
            <MainNavigation />
            {!isAuthenticated && singUpPopupShow && (
              <div
                className={`fixed ${
                  isMobile ? 'bottom-16' : 'bottom-6 right-6 max-w-[550px]'
                } left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 flex items-center z-50 ${
                  isMobile ? '' : 'rounded-xl mx-auto shadow-2xl'
                } transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="relative flex items-center justify-between w-full p-5 px-8">
                  {/* Close Button */}
                  <X
                    className="absolute top-2 right-2 w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setSingUpPopupShow(false)}
                  />
                  {/* Content */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Star />
                    </div>
                    <p className="text-white text-sm md:text-base font-medium leading-tight">
                      Unlock exclusive content and chat with AI characters! Sign
                      up now!
                    </p>
                  </div>
                  {/* Sign Up Button */}
                  <button
                    onClick={() =>
                      openModal({
                        type: 'message',
                        content: (
                          <AuthModal
                            initialMode="signup"
                            onClose={() => closeModal()}
                          />
                        ),
                      })
                    }
                    className="bg-white text-pink-500 px-4 py-2 rounded-full text-sm md:text-base font-semibold hover:bg-pink-100 transition-colors duration-200 shadow-md whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    // </TonConnectUIProvider>
  );
}
