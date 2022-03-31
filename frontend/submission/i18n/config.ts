import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import log from 'loglevel'
import {initReactI18next} from 'react-i18next'

import {steps} from '../schema'
import {WizardStep} from '../schema/types'
import {jsonSchema2Translation} from '../schema/utils'
import {LocalizedFormTranslation} from '../schema/utils/types'
import {foldInner2Outer, isDevelopment} from '../utils'
import de from './de.json'
import en from './en.json'
import {formNamespace} from './formNamespace'

type LanguageKeys = 'en' | 'de'
const languages: LanguageKeys[] = ['en', 'de']

type FormTranslationFactoryCallback = (step: WizardStep, lang: string) => any


const formTranslationFactory: (callback: FormTranslationFactoryCallback) => { de: { [k: string]: any }; en: { [k: string]: any } } =
  (callback) => languages
    .reduce(
      (prev, lang) => ({
        ...prev,
        [lang]: {
          ...(prev[lang] || {}),
          ...Object.fromEntries(
            steps.map((step) =>
              [formNamespace(step.name),
                callback(step, lang)]))
        }
      }),
      {de: {}, en: {}})

const formTranslations = formTranslationFactory(
  ({name, jsonschema, translation}, lang) =>
    translation?.[lang] || jsonSchema2Translation(jsonschema, true))

export const generatedDefaultFormTranslations = formTranslationFactory(
  ({jsonschema}) =>
    jsonSchema2Translation(jsonschema, true))

export const fromTranslationStateToFormTranslation = (formTranslation: { [k: string]: LocalizedFormTranslation }) =>
  foldInner2Outer(formTranslation)



export const resources: { [k in LanguageKeys]: any } = {
  en: {
    common: {
      ...en,
    },
    ...formTranslations.en
  },
  de: {
    common: {
      ...de,
    },
    ...formTranslations.de
  },
}

const availableLanguages = Object.keys(resources)

const ns = [...Object.keys(formTranslations.en), 'common']

export const getAvailableLanguages = () => availableLanguages

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    fallbackLng: 'en',
    ns ,
    defaultNS: 'common',

    missingKeyHandler: (lngs, ns1, key) => log.debug('missing translation', {key, lngs, ns}),
    saveMissing: isDevelopment(),

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

