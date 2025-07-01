import { Suspense } from 'react';
import SubscriptionSection from '@/app/[locale]/profile/subscription/page';
import { getSubscriptionTiers, getUserSubscriptionTier } from '@/lib/services/v1/server/billing';
import { Loader } from '@/components/ui/loader';

async function SubscriptionContent() {
  const userSubscriptionTier = await getUserSubscriptionTier();
  const data = await getSubscriptionTiers();

  return <SubscriptionSection tiers={data} userSubscriptionTier={userSubscriptionTier} />;
}

export default function SubscriptionLayout({}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
     <Loader/>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}