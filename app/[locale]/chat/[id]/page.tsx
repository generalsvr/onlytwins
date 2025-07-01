import CharacterChatTemplate from '@/components/chat/character-chat-template';
import { getConversationsHistorySSR } from '@/lib/services/v1/server/utils/useServerConversationHistory';
import { getAgentSSR } from '@/lib/services/v1/server/utils/useServerAgent';
import { getConversationsSSR } from '@/lib/services/v1/server/utils/useServerConversations';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chat | OnlyTwins',
    description: 'Chat'
  };
}
export default async function CharacterChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    // Получаем базовые данные параллельно
    const [data, conversationsResult] = await Promise.all([
      getAgentSSR(Number(id)),
      getConversationsSSR(Number(id)),
    ]);

    const { conversations } = conversationsResult;

    // Проверяем, что conversations получены
    if (!conversations || conversations.length === 0) {
      return (
        <CharacterChatTemplate
          conversationId=""
          history={[]}
          character={data.data}
        />
      );
    }

    const [lastConv] = conversations;

    // Получаем историю только если есть conversationId
    const { history } = lastConv?.conversationId
      ? await getConversationsHistorySSR(lastConv.conversationId)
      : { history: [] };

    return (
      <CharacterChatTemplate
        conversationId={lastConv?.conversationId || ''}
        history={history.reverse()}
        character={data.data}
      />
    );
  } catch (error) {
    console.error('Error loading chat data:', error);
    // Обработка ошибки или редирект
    throw error;
  }
}
