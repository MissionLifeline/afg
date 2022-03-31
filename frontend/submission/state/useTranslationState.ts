import create from 'zustand'

import {buildInitialTranslation} from '../schema'
import {FormTranslation, LocalizedFormTranslation} from '../schema/utils/types'


export interface TranslationState {
  formTranslation: {
    [k: string]: LocalizedFormTranslation
  },
  setFormTranslation: (name: string, t: LocalizedFormTranslation) => void
  setFormTranslationForLang: (name: string, language: string, t: FormTranslation) => void
  setForAll: (t: {    [k: string]: LocalizedFormTranslation }) => void
}

export const useTranslationState = create<TranslationState>(set => ({
  formTranslation: buildInitialTranslation(),
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
