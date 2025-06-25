"use server"
import { getAgentsSSR } from '@/lib/ssr/agent-ssr';
import ExplorePage from '@/components/feed-page';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Explore | OnlyTwins',
    description: 'Explore all own agents'
  };
}
export default async function FeedPageWrapper() {

  const { data } = await getAgentsSSR();
  return <ExplorePage agents={data} />;
}
