import create from 'zustand'

import {steps} from '../schema'
import {FormTranslation, LocalizedFormTranslation} from '../schema/utils/types'
import {filterUndefOrNull} from '../utils'


export interface TranslationState {
  formTranslation: {
    [k: string]: LocalizedFormTranslation
  },
  setFormTranslation: (name: string, t: LocalizedFormTranslation) => void
  setFormTranslationForLang: (name: string, language: string, t: FormTranslation) => void
  setForAll: (t: {    [k: string]: LocalizedFormTranslation }) => void
}

const initialFormTranslation = Object.fromEntries(filterUndefOrNull(steps.map(({name, translation}) => translation && [name, translation] )))

export const useTranslationState = create<TranslationState>(set => ({
  formTranslation: initialFormTranslation,
  setForAll: t => set(() => ({formTranslation: t})),
  setFormTranslation: (name, t) => set(({formTranslation}) => ({
    formTranslation: {
      ...formTranslation,
      [name]: t
    }
  })),
  setFormTranslationForLang: (name, language, t) => set(({formTranslation}) => ({
    formTranslation: {
      ...formTranslation,
      [name]: {
        ...(formTranslation[name] || {}),
        [language]: t
      }
    }
  }))
}))
