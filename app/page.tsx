"use server"
import FeedPage from '@/components/feed-page';
import { getAgentsSSR } from '@/lib/ssr/agent-ssr';
import ModelFeed from '@/components/feed';

export default async function FeedPageWrapper() {
  const { data } = await getAgentsSSR();
  return <ModelFeed agents={data} />;
}
