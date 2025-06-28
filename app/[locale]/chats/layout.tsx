import ChatPage from '@/app/[locale]/chats/page';
import { getConversationsSSR } from '@/lib/services/v1/server/utils/useServerConversations';
import { Metadata } from 'next';

interface ChatPageProps {
  onOpenChat?: (characterId: number) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: (mode: 'login' | 'signup') => void;
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chats | OnlyTwins',
    description: 'Chats with agents'
  };
}
export default async function ChatLayout({}: ChatPageProps) {
  const data = await getConversationsSSR();
  return <ChatPage initialConversations={data.conversations} error={data.error} />;
}
