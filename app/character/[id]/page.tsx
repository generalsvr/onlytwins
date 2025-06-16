'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterProfileTemplate from '@/components/character-profile-template';
import CharacterProfileSkeleton from '@/components/character-profile-skeleton';
import { useAgent } from '@/lib/hooks/useAgent';

export default function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params with React.use()
  const { data, isLoading } = useAgent(Number(id));

  if (isLoading || !data) return <CharacterProfileSkeleton />;

  // useEffect(() => {
  //   // Character data

  //
  //   const foundCharacter = characters.find(
  //     (c) => c.id === Number.parseInt(params.id)
  //   );
  //   if (foundCharacter) {
  //     setCharacter(foundCharacter);
  //   } else {
  //     router.push('/');
  //   }
  // }, [params.id, router]);

  return <CharacterProfileTemplate character={data} />;
}
