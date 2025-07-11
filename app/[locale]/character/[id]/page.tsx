'use server'
import CharacterProfileTemplate from '@/components/character-profile-template';
import { getAgentSSR } from '@/lib/services/v1/server/utils/useServerAgent';
import { Metadata } from 'next';
import { cache } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

const getCachedAgent = cache(async (id: number) => {
  return await getAgentSSR(id);
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedAgent(Number(id));
  return {
    title: `${data.data?.name} | OnlyTwins`,
    description: 'Browse the latest agent feeds',
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getCachedAgent(Number(id));
  return <CharacterProfileTemplate character={data.data} />;
}
