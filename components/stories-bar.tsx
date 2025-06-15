'use client';

import { useState } from 'react';
import SafeImage from './safe-image'; // Changed from { SafeImage } if it was using the named import

interface StoriesBarProps {
  onStoryClick: (characterId: number) => void;
  isAuthenticated: boolean;
  onAuthRequired: (mode: 'login' | 'signup') => void;
}

// Mock data for stories
const STORIES = [
  {
    id: 1,
    characterId: 1,
    name: 'Claire',
    image: '/claire-profile.png',
    hasNewStory: true,
  },
  {
    id: 2,
    characterId: 2,
    name: 'Valeria',
    image: '/valeria-camila-profile.png',
    hasNewStory: true,
  },
  {
    id: 3,
    characterId: 3,
    name: 'Jenny',
    image: '/jennypinky-profile.png',
    hasNewStory: true,
  },
  {
    id: 4,
    characterId: 4,
    name: 'Hana',
    image: '/hana-profile.png',
    hasNewStory: false,
  },
  {
    id: 5,
    characterId: 5,
    name: 'Akari',
    image: '/akari-profile.png',
    hasNewStory: false,
  },
  {
    id: 6,
    characterId: 6,
    name: 'Lee',
    image: '/lee-profile.png',
    hasNewStory: false,
  },
];

export default function StoriesBar({
  onStoryClick,
  isAuthenticated,
  onAuthRequired,
}: StoriesBarProps) {
  const [viewedStories, setViewedStories] = useState<number[]>([]);

  const handleStoryClick = (characterId: number, storyId: number) => {
    if (!isAuthenticated) {
      onAuthRequired('signup');
      return;
    }

    // Mark story as viewed
    if (!viewedStories.includes(storyId)) {
      setViewedStories([...viewedStories, storyId]);
    }

    // Navigate to character profile
    onStoryClick(characterId);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 p-4">
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center"
            onClick={() => handleStoryClick(story.characterId, story.id)}
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 ${
                story.hasNewStory && !viewedStories.includes(story.id)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                  : 'bg-zinc-700'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                <SafeImage
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs mt-1 text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
