"use server"

import ModelFeed from '@/components/feed';
import { Metadata } from 'next';
import { getAgents } from '@/lib/services/v1/server/utils/getAgents';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Feed Page | OnlyTwins',
    description: 'Browse the latest agent feeds'
  };
}
export default async function FeedPageWrapper() {
  const { data } = await getAgents();
  if(!data) return null
  return <ModelFeed agents={data} />;
}
