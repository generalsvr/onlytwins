import React, { Suspense } from 'react';
import './globals.css';
import A11ySkipLink from '@/components/a11y-skip-link';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context';
import MainLayout from '@/app/(layouts)/MainLayout';
import { Inter } from 'next/font/google';
import Modal from '@/components/modal';
import ErrorBoundary from '@/app/(providers)/ErrorBoundary';
import { Loader } from '@/components/ui/loader';
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white hide-scrollbar`}>
        <A11ySkipLink />
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <LanguageProvider>
              <AuthProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <MainLayout>{children}</MainLayout>
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

export const metadata = {
  generator: 'v0.dev',
};
