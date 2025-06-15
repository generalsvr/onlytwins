'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { CHARACTER_CHATS } from '@/data/characters';
import CharacterChatTemplate from '@/components/chat/character-chat-template';
import LoadingScreen from '@/components/loading-screen';
import { useAuth } from '@/contexts/auth-context';

import CharacterChatTemplateSkeleton from '@/components/chat/character-chat-template-skeleton';
import { useAgent } from '@/lib/hooks/useAgent';
import { useAgentConversation } from '@/lib/hooks/usetAgentConversation';
import { useConversations } from '@/lib/hooks/useConversations';
import { useAuthStore } from '@/lib/stores/authStore';
import { useConversationHistory } from '@/lib/hooks/useConversationHistory';

export default function CharacterChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // Unwrap params with React.use()
  const { user, isAuthenticated } = useAuthStore((state) => state);
  const { data: character, isLoading: loading } = useAgent(Number(id));
  const { isLoading: convLoading, conversations } = useConversations(
    Number(user?.id || null),
    Number(id)
  );
  const router = useRouter();
  const [lastConv] = conversations;

  const { history, isLoading: historyLoading } = useConversationHistory(
    lastConv?.conversationId || null
  );

  const handleBack = () => {
    router.push('/');
  };

  const handleAuthRequired = (mode: 'login' | 'signup') => {
    // Redirect to login/signup page or show modal
    router.push(`/?auth=${mode}`);
  };

  console.log({
    loading:loading,
    character:character,
    convLoading: convLoading,
    historyLoading: historyLoading
  })

  if (loading || !character || convLoading || historyLoading) {
    return <CharacterChatTemplateSkeleton />;
  }

  return (
    <CharacterChatTemplate
      conversationId={lastConv?.conversationId || ''}
      history={history}
      character={character}
      onBack={handleBack}
      isAuthenticated={isAuthenticated}
      onAuthRequired={handleAuthRequired}
    />
  );
}
