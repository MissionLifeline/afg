import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from './de.json'
import en from './en.json'

export const resources = {
  en: { translation: en },
  de: { translation: de },
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })
