'use client';

import { SettingsIcon, Gift, Heart, Users, DollarSign } from 'lucide-react';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({
  activePage,
  onNavigate,
}: NavigationProps) {
  const { t } = useLanguage();

  // Listen for custom navigation events
  useEffect(() => {
    const handleNavigation = (e: CustomEvent) => {
      onNavigate(e.detail.page);
    };

    window.addEventListener('navigate', handleNavigation as EventListener);

    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, [onNavigate]);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 rounded-t-3xl">
      <div className="flex justify-around items-center p-4">
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center gap-1 ${activePage === 'settings' ? 'text-white' : 'text-zinc-500'}`}
        >
          <SettingsIcon className="h-6 w-6" />
          <span className="text-xs">{t('nav.settings')}</span>
        </button>

        <button
          onClick={() => onNavigate('gifts')}
          className={`flex flex-col items-center gap-1 ${activePage === 'gifts' ? 'text-white' : 'text-zinc-500'}`}
        >
          <Gift className="h-6 w-6" />
          <span className="text-xs">{t('nav.gifts')}</span>
        </button>

        <button
          onClick={() => onNavigate('models')}
          className={`flex flex-col items-center gap-1 ${activePage === 'models' ? 'text-white' : 'text-zinc-500'}`}
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs">{t('nav.home')}</span>
        </button>

        <button
          onClick={() => onNavigate('affiliate')}
          className={`flex flex-col items-center gap-1 ${activePage === 'affiliate' ? 'text-white' : 'text-zinc-500'}`}
        >
          <Users className="h-6 w-6" />
          <span className="text-xs">{t('nav.affiliate')}</span>
        </button>

        <button
          onClick={() => onNavigate('earn')}
          className={`flex flex-col items-center gap-1 ${activePage === 'earn' ? 'text-white' : 'text-zinc-500'}`}
        >
          <DollarSign className="h-6 w-6" />
          <span className="text-xs">{t('nav.earn')}</span>
        </button>
      </div>
    </div>
  );
}
