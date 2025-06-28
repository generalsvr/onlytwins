"use server"

import ExplorePage from '@/components/feed-page';
import { Metadata } from 'next';
import { getAgents } from '@/lib/services/v1/server/utils/getAgents';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Explore | OnlyTwins',
    description: 'Explore all own agents'
  };
}
export default async function FeedPageWrapper() {

  const { data } = await getAgents();
  return <ExplorePage agents={data} />;
}
