import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'

import {generalTranslation} from '../schema'
import de from './de.json'
import en from './en.json'

type LanguageKeys = 'en' | 'de'

export const resources: { [k in LanguageKeys]: any} = {
  en: {
    translation: {
      ...en,
    },
    form_general: generalTranslation.en
  },
  de: {
    translation: {
      ...de,
    },
    form_general: generalTranslation.de
  },
}

const availableLanguages = Object.keys(resources)

export const getAvailableLanguages = () => availableLanguages

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    fallbackLng: 'en',
    ns: [ 'form_general' ],

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

