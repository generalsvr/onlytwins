import { Locale } from './i18n'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
  zh: () => import('@/dictionaries/zh.json').then((module) => module.default),
} as const

export const getDictionary = async (locale: Locale) => {
  if (!(locale in dictionaries)) {
    return dictionaries.en()
  }
  return dictionaries[locale]()
}
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>