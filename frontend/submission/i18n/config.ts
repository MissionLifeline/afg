import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import log from 'loglevel'
import {initReactI18next} from 'react-i18next'

import {steps, WizardStep} from '../schema'
import {jsonSchema2Translation} from '../schema/utils'
import {LocalizedFormTranslation} from '../schema/utils/types'
import {foldInner2Outer, isDevelopment} from '../utils'
import de from './de.json'
import en from './en.json'
import {formNamespace} from './formNamespace'
import translationHelper_de from './translationHelper/de.json'
import translationHelper_en from './translationHelper/en.json'

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
            steps.filter(({jsonschema}) => !!jsonschema)
              .map((step) =>
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
    common: en,
    translationHelper: translationHelper_en,
    ...formTranslations.en
  },
  de: {
    common: de,
    translationHelper: translationHelper_de,
    ...formTranslations.de
  },
}

const availableLanguages = Object.keys(resources)

const ns = [...Object.keys(formTranslations.en), 'common', 'translationHelper']

export const getAvailableLanguages = () => availableLanguages

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,

    fallbackLng: 'en',
    ns,
    defaultNS: 'common',

    missingKeyHandler: (lngs, ns1, key) => log.debug('missing translation', {key, lngs, ns1}),
    saveMissing: isDevelopment(),

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

