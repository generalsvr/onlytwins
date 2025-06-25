export const locales = ['en', 'ru', 'zh'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'


// Типы для переводов
export interface Translations {
  common: {
    welcome: string
    about: string
    contact: string
    home: string
    language: string
    switchLanguage: string
  }
  navigation: {
    menu: string
    close: string
  }
  pages: {
    aboutTitle: string
    aboutDescription: string
  }
}