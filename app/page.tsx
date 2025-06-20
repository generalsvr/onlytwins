"use server"
import FeedPage from '@/components/feed-page';
import { getAgentsSSR } from '@/lib/ssr/agent-ssr';

export default async function FeedPageWrapper() {
  const { data } = await getAgentsSSR();
  return <FeedPage agents={data} />;
}
