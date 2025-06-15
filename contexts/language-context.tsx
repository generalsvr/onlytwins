'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { translations, supportedLanguages } from '@/translations';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const defaultLanguage = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem('language');
      if (
        savedLanguage &&
        supportedLanguages.some((lang) => lang.id === savedLanguage)
      ) {
        setLanguage(savedLanguage);
      }
    }
  }, [isClient]);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('language', language);
    }
  }, [language, isClient]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[language] || !translations[language][key]) {
      // Fallback to English or return the key itself if not found
      return translations[defaultLanguage]?.[key] || key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
