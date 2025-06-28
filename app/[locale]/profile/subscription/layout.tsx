'use server';
import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/services/v1/server/auth';
import SubscriptionSection from '@/app/[locale]/profile/subscription/page';
import { getSubscriptionTiers, getUserSubscriptionTier } from '@/lib/services/v1/server/billing';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Subscription | OnlyTwins',
    description: 'Your profile',
  };
}

export default async function SubscriptionLayout({}: {
  children: React.ReactNode;
}) {
  const userSubscriptionTier = await getUserSubscriptionTier()
  const data = await getSubscriptionTiers();
  console.log(userSubscriptionTier)
  return <SubscriptionSection tiers={data} userSubscriptionTier={userSubscriptionTier} />;
}
