import React, { Suspense } from 'react';
import './globals.css';
import A11ySkipLink from '@/components/a11y-skip-link';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import ClientLayout from '@/app/(layouts)/ClientLayout';
import { Inter } from 'next/font/google';
import Modal from '@/components/modal';
import ErrorBoundary from '@/app/(providers)/ErrorBoundary';
import useAuthServerState from '@/lib/hooks/ssr/useAuthServerState';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialAuthState = await useAuthServerState();
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white hide-scrollbar`}>
        <A11ySkipLink />
        <ErrorBoundary>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <ClientLayout initialAuthState={initialAuthState}>{children}</ClientLayout>
                  <Modal />
                </Suspense>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

