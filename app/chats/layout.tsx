import ChatPage from '@/app/chats/page';
import { getConversationsSSR } from '@/lib/hooks/ssr/useServerConversations';

interface ChatPageProps {
  onOpenChat?: (characterId: number) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: (mode: 'login' | 'signup') => void;
}

export default async function ChatLayout({}: ChatPageProps) {
  const data = await getConversationsSSR();
  return <ChatPage initialConversations={data.conversations} error={data.error} />;
}
