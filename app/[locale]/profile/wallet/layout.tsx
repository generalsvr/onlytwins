'use server';
import { Metadata } from 'next';
import { getPaymentsHistory } from '@/lib/services/v1/server/payments';
import WalletPage from '@/app/[locale]/profile/wallet/page';
import { Suspense } from 'react';
import { Loader } from '@/components/ui/loader';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wallet | OnlyTwins',
    description: 'Your Wallet',
  };
}
async function WalletContent() {
  const txHistory = await getPaymentsHistory(1);

  return <WalletPage history={txHistory} />;
}
export default async function WalletLayout() {
  return (
    <Suspense fallback={<Loader />}>
      <WalletContent />
    </Suspense>
  );
}
