'use client';

import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { supportedLanguages } from '@/translations';

interface LanguagePageProps {
  onBack: () => void;
}

export default function LanguagePage({ onBack }: LanguagePageProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = (languageId: string) => {
    setLanguage(languageId);
    onBack();
  };

  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-4">
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="text-4xl font-bold mb-6">{t('language.title')}</h1>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        {supportedLanguages.map((lang, index) => (
          <div
            key={lang.id}
            className={`p-4 flex justify-between items-center ${
              index !== supportedLanguages.length - 1
                ? 'border-b border-zinc-800'
                : ''
            }`}
            onClick={() => handleLanguageSelect(lang.id)}
          >
            <div>
              <h2 className="text-lg">{t(`language.${lang.id}`)}</h2>
              <p className="text-zinc-400">{lang.nativeName}</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                language === lang.id ? 'border-pink-400' : 'border-zinc-600'
              } flex items-center justify-center`}
            >
              {language === lang.id && (
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
