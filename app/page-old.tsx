'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import MainNavigation from '@/components/main-navigation';
import FeedPage from '@/components/feed-page';
import ChatPage from '@/components/chat-page';
import ExplorePage from '@/components/explore-page';
import EarnPage from '@/components/earn-page';
import ProfilePage from '@/components/profile-page';
import CharacterProfilePage from '@/components/character-profile-page';
import ChatWindowPage from '@/components/chat-window-page';
import AuthModal from '@/components/auth/auth-modal';
import LoadingScreen from '@/components/loading-screen';
import Header from '@/components/header';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home(children) {
  const { user, isLoading, isAuthenticated, platform, shouldShowAuth } =
    useAuth();
  const [activePage, setActivePage] = useState('feed');
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [showChat, setShowChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobile, setIsMobile] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for auth param in URL
  useEffect(() => {
    const authParam = searchParams?.get('auth');
    if (authParam && (authParam === 'login' || authParam === 'signup')) {
      setAuthMode(authParam as 'login' | 'signup');
      setShowAuthModal(true);
    }
  }, [searchParams]);

  // Mark page as loaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle character selection - go to profile
  const handleCharacterSelect = (characterId: number) => {
    console.log('Opening character profile:', characterId);

    const profilePaths: Record<number, string> = {
      1: '/character/claire',
      2: '/character/valeria-camila',
      3: '/character/jenny',
      4: '/character/lee',
      5: '/character/hana',
      6: '/character/akari',
    };

    if (profilePaths[characterId]) {
      router.push(profilePaths[characterId]);
      return;
    }

    setSelectedCharacterId(characterId);
    setActivePage('character-profile');
  };

  // Handle opening chat with a character
  const handleOpenChat = (characterId: number) => {
    console.log('Opening chat with character:', characterId);

    if (!isAuthenticated && platform === 'web') {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    router.push(`/chat/${characterId}`);
  };

  // Handle closing chat
  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Handle navigation
  const handleNavigate = (page: string) => {
    console.log('Navigating to page:', page);

    if (
      !isAuthenticated &&
      platform === 'web' &&
      (page === 'profile' || page === 'earn')
    ) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    setActivePage(page);
  };

  // Handle opening auth modal - only on web

  // Show loading screen while checking authentication
  if (isLoading || !isPageLoaded) {
    return <LoadingScreen />;
  }

  // Render the appropriate page based on activePage state
  const renderPage = () => {
    if (showChat && selectedCharacterId) {
      return (
        <ChatWindowPage
          characterId={selectedCharacterId}
          onClose={handleCloseChat}
        />
      );
    }

    switch (activePage) {
      case 'feed':
        return (
          <FeedPage
            onCharacterSelect={handleCharacterSelect}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      case 'chat':
        return (
          <ChatPage
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      case 'explore':
        return (
          <ExplorePage
            onCharacterSelect={handleCharacterSelect}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      case 'earn':
        return isAuthenticated || platform === 'telegram' ? (
          <EarnPage />
        ) : (
          <FeedPage
            onCharacterSelect={handleCharacterSelect}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      case 'profile':
        return isAuthenticated || platform === 'telegram' ? (
          <ProfilePage />
        ) : (
          <FeedPage
            onCharacterSelect={handleCharacterSelect}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      case 'character-profile':
        return selectedCharacterId ? (
          <CharacterProfilePage
            characterId={selectedCharacterId}
            onBack={() => setActivePage('feed')}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        ) : (
          <FeedPage
            onCharacterSelect={handleCharacterSelect}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
      default:
        return (
          <FeedPage
            onCharacterSelect={handleCharacterSelect}
            onOpenChat={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleOpenAuth}
          />
        );
    }
  };

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      {/* Main Navigation - Absolute on Desktop, Fixed Bottom on Mobile */}

      {/* Main Content Container */}
      <div
        className={`max-w-7xl mx-auto flex-1 flex flex-col min-h-screen ${
          isMobile && 'pb-16'
        }`}
      >
        {/*<div className="flex-1">{renderPage()}</div>*/}
      </div>

      {/* Auth Modal */}
      {showAuthModal && platform === 'web' && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
