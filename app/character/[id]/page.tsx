import CharacterProfileTemplate from '@/components/character-profile-template';
import { getAgentSSR } from '@/lib/hooks/ssr/useServerAgent';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getAgentSSR(Number(id));
  console.log(data)
  return <CharacterProfileTemplate character={data.data} />;
}
