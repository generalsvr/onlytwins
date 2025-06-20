import CharacterChatTemplate from '@/components/chat/character-chat-template';
import { getConversationsHistorySSR } from '@/lib/hooks/ssr/useServerConversationHistory';
import { getAgentSSR } from '@/lib/hooks/ssr/useServerAgent';
import { getConversationsSSR } from '@/lib/hooks/ssr/useServerConversations';

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
        history={history}
        character={data.data}
      />
    );
  } catch (error) {
    console.error('Error loading chat data:', error);
    // Обработка ошибки или редирект
    throw error;
  }
}
