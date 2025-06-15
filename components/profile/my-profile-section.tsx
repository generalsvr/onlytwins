'use client';

import { useState } from 'react';
import { ArrowLeft, Camera, Edit } from 'lucide-react';
import SafeImage from '../safe-image';
import { useAuth } from '@/contexts/auth-context';

interface MyProfileSectionProps {
  onBack: () => void;
}

export default function MyProfileSection({ onBack }: MyProfileSectionProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would typically save the changes to the user profile
    // For now, we'll just toggle the editing state
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-zinc-900 p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto bg-pink-500 px-4 py-2 rounded-lg"
          >
            <Edit size={18} />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <SafeImage
                src={user?.avatar || '/user-profile-illustration.png'}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
                fallbackSrc="/user-profile-illustration.png"
              />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full">
                <Camera size={16} />
              </button>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 w-full text-center text-xl font-bold mb-2"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-1">{user?.name || 'User'}</h2>
          )}
          <p className="text-zinc-400">{user?.email || ''}</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">About Me</h3>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 w-full h-32 resize-none"
              placeholder="Write something about yourself..."
            />
          ) : (
            <p className="text-zinc-300">
              {user?.bio ||
                "Hi there! I'm a user of OnlyTwins. I enjoy chatting with AI characters and exploring new experiences."}
            </p>
          )}
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-400 text-sm">Email</p>
              <p className="text-white">{user?.email || 'user@example.com'}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Member Since</p>
              <p className="text-white">{user?.joinDate || 'January 2023'}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Subscription</p>
              <p className="text-white">
                {user?.isPremium ? 'Premium' : 'Free Plan'}
              </p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-zinc-800 py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-pink-500 py-3 rounded-lg font-medium"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
