"use server"

import { getAgentsSSR } from '@/lib/ssr/agent-ssr';
import ModelFeed from '@/components/feed';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Feed Page | OnlyTwins',
    description: 'Browse the latest agent feeds'
  };
}
export default async function FeedPageWrapper() {
  const { data } = await getAgentsSSR();
  if(!data) return null
  return <ModelFeed agents={data} />;
}
