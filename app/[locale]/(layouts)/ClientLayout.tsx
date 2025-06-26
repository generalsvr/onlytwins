// app/client-layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import '../../globals.css';
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
import { authService } from '@/lib/services/v1/auth';
import { Loader } from '@/components/ui/loader';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserResponse } from '@/lib/types/auth';
import SuccessPayment from '@/components/modals/success-payment';
import { useLocale } from '@/contexts/LanguageContext';

interface InitialAuthState {
  user: UserResponse;
  isAuthenticated: boolean;
  needsRefresh: boolean;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  initialAuthState: InitialAuthState;
}

export default function ClientLayout({
  children,
  initialAuthState,
}: ClientLayoutProps) {
  const { isAuthenticated, setUser, getCurrentUser, setIsLoading } =
    useAuthStore();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModalStore();
  const { isMobile } = useWindowSize();
  const [signUpPopupShow, setSignUpPopupShow] = useState(true);
  const { setToastNotification } = useNotificationStore();
  const { dictionary } = useLocale()
  const isChatPage = pathname && pathname.includes('/chat/');

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (initialAuthState.user) {
          setUser(initialAuthState.user);
          return;
        }

        if (initialAuthState.needsRefresh) {
          try {
            await authService.refreshToken();
            await getCurrentUser();
          } catch (error) {
            console.error('Failed to refresh token:', error);
            setUser(null);
          }
          return;
        }

        // Если не аутентифицирован
        setUser(null);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [initialAuthState, setUser, getCurrentUser, setIsLoading]);

  // Обработка параметров платежа
  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');

    if (paymentStatus === 'success') {
      openModal({
        type: 'message',
        content: <SuccessPayment />,
      });
    } else if (paymentStatus === 'failed') {
      openModal({
        type: 'message',
        content: <FailedPayment />,
      });
    }

    setReferralCookie();
  }, [searchParams, setToastNotification, openModal]);

  return (
      <AuthProvider>
        <div
          className={
            isChatPage
              ? 'mx-auto max-w-[1440px]'
              : isMobile
                ? `w-full h-full ${pathname.includes('chat') && 'overflow-hidden'}`
                : 'mx-auto max-w-[1440px] pt-6 px-4'
          }
        >
          <A11ySkipLink />
          {!isChatPage && <Header />}

          <Loader />
          <div
            className={
              isChatPage
                ? ''
                : isMobile
                  ? `pt-2 ${!pathname.includes('chat') && 'pb-20'}`
                  : 'pt-12'
            }
          >
            {children}
          </div>
          {isMobile && isChatPage ? <></> : <MainNavigation />}

          {!isAuthenticated && signUpPopupShow && (
            <div
              className={`fixed ${
                isMobile ? 'bottom-16' : 'bottom-6 right-6 max-w-[550px]'
              } left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 flex items-center z-50 ${
                isMobile ? '' : 'rounded-xl mx-auto shadow-2xl'
              } transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="relative flex items-center justify-between w-full p-5 px-8">
                <X
                  className="absolute top-2 right-2 w-5 h-5 text-white/80 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setSignUpPopupShow(false)}
                />
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Star />
                  </div>
                  <p className="text-white text-sm md:text-base font-medium leading-tight">
                    {dictionary.auth.signup.signUpDescription}
                  </p>
                </div>
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
                  {dictionary.auth.signup.signUp}
                </button>
              </div>
            </div>
          )}
        </div>
      </AuthProvider>
  );
}
