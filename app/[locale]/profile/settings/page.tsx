'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Globe,
  Info,
  ChevronRight,
  Palette,
  FileText,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { useLocale } from '@/contexts/LanguageContext';
import { VERSION } from '@/lib/consts';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const { setLocale, dictionary, locale } = useLocale();
  const { setTheme, theme, resolvedTheme } = useTheme();

  // Получаем текущую локаль из URL параметров
  const currentLocale = params?.locale as string;

  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false, // Инициализируем как false, обновим из темы
    language: '',
    notifications: true,
    soundEffects: true,
    autoPlay: false,
    dataSaver: false,
    analytics: true,
    marketing: false,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  // Функция для получения названия языка по коду
  const getLanguageNameByCode = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    return language ? language.name : 'English';
  };

  // Избегаем hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Синхронизация с темой при изменении
  useEffect(() => {
    if (mounted && theme) {
      const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

      setSettings(prev => ({
        ...prev,
        darkMode: isDark
      }));

      // Сохраняем настройки в localStorage
      const savedSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');
      const updatedSettings = {
        ...savedSettings,
        darkMode: isDark,
        theme: theme // Сохраняем также исходную тему (dark/light/system)
      };
      localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
    }
  }, [theme, resolvedTheme, mounted]);

  // Инициализация при загрузке компонента
  useEffect(() => {
    if (!mounted) return;

    setLoading(false);

    // Загружаем сохраненные настройки из localStorage
    const savedSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');

    // Устанавливаем текущий язык из URL
    const currentLanguageName = getLanguageNameByCode(currentLocale);

    // Синхронизируем состояние с сохраненными настройками
    setSettings(prevSettings => ({
      ...prevSettings,
      language: currentLanguageName,
      notifications: savedSettings.notifications ?? prevSettings.notifications,
      soundEffects: savedSettings.soundEffects ?? prevSettings.soundEffects,
      autoPlay: savedSettings.autoPlay ?? prevSettings.autoPlay,
      dataSaver: savedSettings.dataSaver ?? prevSettings.dataSaver,
      analytics: savedSettings.analytics ?? prevSettings.analytics,
      marketing: savedSettings.marketing ?? prevSettings.marketing,
      // darkMode будет установлен в useEffect выше из темы
    }));

    // Если есть сохраненная тема, но она отличается от текущей
    if (savedSettings.theme && savedSettings.theme !== theme) {
      setTheme(savedSettings.theme);
    }

    setIsInitialized(true);
  }, [setLoading, currentLocale, mounted, theme, setTheme]);

  const handleBack = () => {
    router.back();
  };

  // Функция для обновления настроек с сохранением в localStorage
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };

      // Сохраняем в localStorage (исключаем language, так как он управляется отдельно)
      if (key !== 'language') {
        const savedSettings = JSON.parse(localStorage.getItem('app-settings') || '{}');
        const updatedSettings = { ...savedSettings, [key]: value };
        localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
      }

      return newSettings;
    });
  };

  // Обработчик изменения языка
  const handleLanguageChange = (languageName: string) => {
    const selectedLanguage = languages.find(
      (lang) => lang.name === languageName
    );

    if (selectedLanguage) {
      const newLocale = selectedLanguage.code;

      // Обновляем состояние
      updateSetting('language', languageName);

      // Обновляем localStorage для локали
      localStorage.setItem('locale', newLocale);

      // Обновляем контекст локализации
      setLocale(newLocale);

      // Обновляем URL
      const pathSegments = pathname.split('/').filter(Boolean);

      // Заменяем локаль в URL
      if (pathSegments.length > 0) {
        const isFirstSegmentLocale = languages.some(
          (lang) => lang.code === pathSegments[0]
        );

        if (isFirstSegmentLocale) {
          pathSegments[0] = newLocale;
        } else {
          pathSegments.unshift(newLocale);
        }
      } else {
        pathSegments.push(newLocale);
      }

      const newPath = '/' + pathSegments.join('/');
      router.replace(newPath);
    }
  };

  // Обработчик изменения темы
  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? 'dark' : 'light';

    // Обновляем тему через next-themes
    setTheme(newTheme);

    // updateSetting будет вызван автоматически через useEffect
    // когда изменится theme из next-themes
  };

  console.log("Current theme:", theme, "Resolved theme:", resolvedTheme, "Settings darkMode:", settings.darkMode);

  const settingSections = useMemo(
    () => [
      {
        title: dictionary.settings.appearance,
        icon: Palette,
        items: [
          // {
          //   id: 'theme',
          //   icon: settings.darkMode ? Moon : Sun,
          //   title: dictionary.settings.darkMode,
          //   description: dictionary.settings.darkModeDesc,
          //   type: 'toggle',
          //   value: settings.darkMode,
          //   onChange: handleThemeChange,
          // },
          {
            id: 'language',
            icon: Globe,
            title: dictionary.settings.language,
            description: dictionary.settings.languageDesc,
            type: 'select',
            value: settings.language,
            options: languages,
            onChange: handleLanguageChange,
          },
        ],
      },
      // Другие секции настроек можно добавить здесь
      // {
      //   title: dictionary.settings.notificationsSounds,
      //   icon: Bell,
      //   items: [
      //     {
      //       id: 'notifications',
      //       icon: Bell,
      //       title: dictionary.settings.pushNotifications,
      //       description: dictionary.settings.pushNotificationsDesc,
      //       type: 'toggle',
      //       value: settings.notifications,
      //       onChange: (value: boolean) => updateSetting('notifications', value),
      //     },
      //     {
      //       id: 'sounds',
      //       icon: settings.soundEffects ? Volume2 : VolumeX,
      //       title: dictionary.settings.soundEffects,
      //       description: dictionary.settings.soundEffectsDesc,
      //       type: 'toggle',
      //       value: settings.soundEffects,
      //       onChange: (value: boolean) => updateSetting('soundEffects', value),
      //     },
      //   ],
      // },
      {
        title: dictionary.settings.about,
        icon: Info,
        items: [
          {
            id: 'version',
            icon: Download,
            title: dictionary.settings.appVersion,
            description: VERSION,
            type: 'info',
            value: VERSION,
          },
          {
            id: 'terms',
            icon: FileText,
            title: dictionary.settings.termsOfService,
            description: dictionary.settings.termsOfServiceDesc,
            type: 'navigation',
            action: () => console.log('Navigate to terms'),
          },
          {
            id: 'privacy-policy',
            icon: FileText,
            title: dictionary.settings.privacyPolicy,
            description: dictionary.settings.privacyPolicyDesc,
            type: 'navigation',
            action: () => console.log('Navigate to privacy policy'),
          },
        ],
      },
    ],
    [dictionary.settings, settings, handleThemeChange]
  );

  const renderToggle = (value: boolean, onChange: (value: boolean) => void) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-12 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 shadow-lg"></div>
    </label>
  );

  const renderSelect = (
    value: string,
    options: any[],
    onChange: (value: string) => void
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-3 py-2 text-white focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
    >
      {options.map((option) => (
        <option key={option.code} value={option.name} className="bg-zinc-800">
          {option.flag} {option.name}
        </option>
      ))}
    </select>
  );

  // Показываем заглушку пока не смонтировался компонент
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
          >
            <ArrowLeft size={20} className="text-zinc-300" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            {dictionary.settings.settings}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-pink-500/30">
                  <section.icon size={20} className="text-pink-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Section Items */}
            <div className="divide-y divide-zinc-800/50">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                  className={`p-4 hover:bg-zinc-800/30 transition-all duration-300 ${
                    item.type === 'navigation' ? 'cursor-pointer' : ''
                  }`}
                  onClick={item.type === 'navigation' ? item.action : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                        <item.icon size={18} className="text-zinc-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.type === 'toggle' &&
                        renderToggle(item.value, item.onChange)}
                      {item.type === 'select' &&
                        renderSelect(item.value, item.options, item.onChange)}
                      {item.type === 'info' && (
                        <div className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                          <span className="text-sm text-zinc-300">
                            {item.value}
                          </span>
                        </div>
                      )}
                      {item.type === 'navigation' && (
                        <ChevronRight size={18} className="text-zinc-500" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (settingSections.length + 1) * 0.1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/30 rounded-full border border-zinc-800/50">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">OT</span>
            </div>
            <span className="text-zinc-400 text-sm">OnlyTwins {VERSION}</span>
          </div>
          <p className="text-zinc-500 text-xs mt-2">
            {dictionary.settings.madeWithLove}
          </p>
        </motion.div>
      </div>
    </div>
  );
}