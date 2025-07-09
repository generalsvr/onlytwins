import ChatPage from '@/app/[locale]/chats/page';
import { getConversationsSSR } from '@/lib/services/v1/server/utils/useServerConversations';
import { Metadata } from 'next';
import {
  getSubscriptionTiers,
  getUserSubscriptionTier,
} from '@/lib/services/v1/server/billing';

interface ChatPageProps {
  onOpenChat?: (characterId: number) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: (mode: 'login' | 'signup') => void;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chats | OnlyTwins',
    description: 'Chats with agents',
  };
}

export default async function ChatLayout({}: ChatPageProps) {
  const userSubscriptionTier = await getUserSubscriptionTier();

  // Only fetch conversations if user has a subscription
  const data = userSubscriptionTier?.globalSubscription
    ? await getConversationsSSR()
    : { conversations: [], error: null };

  return (
    <ChatPage
      userSubscription={userSubscriptionTier?.globalSubscription}
      initialConversations={data.conversations}
      error={data.error}
    />
  );
}