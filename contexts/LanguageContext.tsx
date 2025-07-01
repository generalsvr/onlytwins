'use client';

import { createContext, JSX, useContext, useState, useCallback } from 'react';
import type { Dictionary } from '@/dictionaries';

type LocaleContextType = {
  locale: string;
  dictionary: Dictionary;
  setLocale: (newLocale: string) => void;
  availableLocales: string[];
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  locale: initialLocale,
  dictionary: initialDictionary,
}: {
  children: JSX.Element | JSX.Element[];
  locale: string;
  dictionary: Dictionary;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [dictionary, setDictionary] = useState(initialDictionary);

  const availableLocales = ['en', 'ru', 'zh'];

  // Функция для смены локали
  const setLocale = useCallback(
    async (newLocale: string) => {
      if (!availableLocales.includes(newLocale)) {
        console.warn(`Locale ${newLocale} is not supported`);
        return;
      }

      try {
        // Динамически загружаем новый словарь
        const { getDictionary } = await import('@/dictionaries');
        const newDictionary = await getDictionary(newLocale as 'en' | 'ru' | 'zh');

        // Обновляем состояние
        setLocaleState(newLocale);
        setDictionary(newDictionary);

        // Сохраняем в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('locale', newLocale);

          // Обновляем HTML lang атрибут
          document.documentElement.lang = newLocale;
        }
      } catch (error) {
        console.error('Error loading dictionary for locale:', newLocale, error);
      }
    },
    [availableLocales]
  );

  const value = {
    locale,
    dictionary,
    setLocale,
    availableLocales,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LanguageProvider');
  }
  return context;
}

