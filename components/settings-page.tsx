'use client';

import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { supportedLanguages } from '@/translations';

interface SettingsPageProps {
  onUpgradeClick: () => void;
}

export default function SettingsPage({ onUpgradeClick }: SettingsPageProps) {
  const { language, t } = useLanguage();

  // Get access to router
  const handleLanguageClick = () => {
    // Navigate to language page
    window.dispatchEvent(
      new CustomEvent('navigate', { detail: { page: 'language' } })
    );
  };

  // Find the current language name
  const currentLanguage =
    supportedLanguages.find((lang) => lang.id === language)?.name || 'English';

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-6">{t('settings.title')}</h1>

      <div className="bg-zinc-900 rounded-xl p-4 mb-4">
        <h2 className="text-lg text-zinc-400 mb-2">{t('settings.yourPlan')}</h2>
        <h3 className="text-5xl font-bold mb-6">{t('settings.free')}</h3>
        <button
          onClick={onUpgradeClick}
          className="w-full bg-pink-400 text-white py-3 rounded-md"
        >
          {t('common.upgrade')}
        </button>
      </div>

      <div className="bg-zinc-900 rounded-xl p-4">
        <button
          onClick={handleLanguageClick}
          className="w-full flex justify-between items-center text-left"
        >
          <h2 className="text-lg">{t('settings.language')}</h2>
          <div className="flex items-center text-zinc-400">
            <span>{currentLanguage}</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </div>
        </button>
      </div>
    </div>
  );
}
