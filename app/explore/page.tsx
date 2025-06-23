"use server"
import { getAgentsSSR } from '@/lib/ssr/agent-ssr';
import ExplorePage from '@/components/feed-page';

export default async function FeedPageWrapper() {
  const { data } = await getAgentsSSR();
  return <ExplorePage agents={data} />;
}
