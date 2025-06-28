import React, { Suspense } from 'react';
import '../globals.css';
import A11ySkipLink from '@/components/a11y-skip-link';
import { ThemeProvider } from '@/app/[locale]/(providers)/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientLayout from '@/app/[locale]/(layouts)/ClientLayout';
import { Inter } from 'next/font/google';
import Modal from '@/components/modal';
import ErrorBoundary from '@/app/[locale]/(providers)/ErrorBoundary';
import getAuthState from '@/lib/services/v1/server/utils/getAuthState';
import { getDictionary } from '@/dictionaries';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico', // Путь к favicon
    apple: '/favicon.png', // Для Apple устройств
  },
};
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialAuthState = await getAuthState();
  const dict = await getDictionary(locale as 'en' | 'ru' | 'zh');
  return (
    <html lang="en">
      <body className={`${inter.className} hide-scrollbar`}>
        <A11ySkipLink />
        <ErrorBoundary>
          <LanguageProvider dictionary={dict} locale={locale}>
            <Suspense fallback={<div>Loading...</div>}>
              <ClientLayout initialAuthState={initialAuthState}>
                {children}
              </ClientLayout>
              <Modal />
            </Suspense>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
