'use client';

import { ArrowLeft, Plus } from 'lucide-react';

interface MyCharactersSectionProps {
  onBack: () => void;
}

export default function MyCharactersSection({
  onBack,
}: MyCharactersSectionProps) {
  // Sample characters


  return (
    <div>
      {/* Header */}
      <div className="bg-zinc-900 p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">My Characters</h1>
      </div>

      {/* Characters Content */}
      <div className="p-4">
        {/* Create New Character Button */}
        <button className="w-full bg-zinc-900 rounded-xl p-4 flex items-center justify-center mb-6">
          <Plus size={20} className="mr-2 text-pink-500" />
          <span className="font-medium">Create New Character</span>
        </button>

        {/* Characters List */}
        <div className="space-y-4">
          {/*{characters.map((character) => (*/}
          {/*  <div*/}
          {/*    key={character.id}*/}
          {/*    className="bg-zinc-900 rounded-xl overflow-hidden"*/}
          {/*  >*/}
          {/*    <div className="relative">*/}
          {/*      <SafeImage*/}
          {/*        src={character.image}*/}
          {/*        alt={character.name}*/}
          {/*        width={400}*/}
          {/*        height={200}*/}
          {/*        className="w-full h-40 object-cover"*/}
          {/*      />*/}
          {/*      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">*/}
          {/*        <div>*/}
          {/*          <h3 className="text-xl font-bold">{character.name}</h3>*/}
          {/*          <div className="flex space-x-4 text-sm text-white/80">*/}
          {/*            <span>{character.followers} followers</span>*/}
          {/*            <span>{character.chats} chats</span>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <div className="p-4">*/}
          {/*      <p className="text-zinc-300 mb-4">{character.description}</p>*/}
          {/*      <div className="flex space-x-3">*/}
          {/*        <button className="flex-1 bg-pink-500 py-2 rounded-lg font-medium flex items-center justify-center">*/}
          {/*          <Edit size={16} className="mr-2" />*/}
          {/*          Edit*/}
          {/*        </button>*/}
          {/*        <button className="flex-1 bg-zinc-800 py-2 rounded-lg font-medium flex items-center justify-center">*/}
          {/*          <Trash2 size={16} className="mr-2" />*/}
          {/*          Delete*/}
          {/*        </button>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </div>
    </div>
  );
}
