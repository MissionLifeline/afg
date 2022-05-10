import _ from 'lodash'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useQuery} from 'react-query'

import {fetcher} from '../api/fetcher'
import {formNamespace, isFormNamespace, resources, stripFormPrefix} from '../i18n'
import {useTranslationState} from './useTranslationState'


export const useLanguageService = () => {
  const [isReady, setIsReady] = useState(false)
  const {data} = useQuery(
      'get_translations',
      fetcher<{ get_translations: { str: string } }, void>('{get_translations {str}}'),
      {staleTime: Infinity, refetchOnWindowFocus: false})
  const {
    i18n: {addResourceBundle, removeResourceBundle, reloadResources}
  } = useTranslation()
  const {setFormTranslationForLang, setCommon} = useTranslationState()
  useEffect(() => {
    if (!data) return
    let trans
    try {
      trans = JSON.parse(data.get_translations.str)
    } catch (e) {
      return
    }
    if (!trans?.allTranslations) return
    Object.entries(trans.allTranslations).forEach(([language, nsData]) => {
      if (typeof nsData !== 'object' || !nsData) return

      Object.entries(nsData).forEach(([ns, translation_]) => {
        const translation = ns === 'common' ? _.merge((resources as any)[language]?.common || {}, translation_) : translation_
        if (typeof translation === 'object' && translation) {
          removeResourceBundle(language, ns)
          addResourceBundle(language, ns, translation, undefined, true)
          reloadResources(language, ns)
          if (isFormNamespace(ns)) {
            const formName = stripFormPrefix(ns)
            setFormTranslationForLang(formName, language, translation)
          }
          if(ns === 'common') setCommon(language, translation)
        }
      })
      const nsData_ = nsData as any

      // we need special treatment for spouse
      const generalTranslation = nsData_[formNamespace('general')]  || {}
      const risksTranslation = nsData_[formNamespace('risks')] || {}
      const applicationTranslation = nsData_[formNamespace('application')] || {}
      const spouseTranslation = nsData_[formNamespace('spouse')] || {}

        setFormTranslationForLang('spouse', language, {
          ...spouseTranslation,
          spouse: {
            ...(spouseTranslation.spouse || {}),
            general: {...generalTranslation, ...(spouseTranslation.spouse?.general || {}) },
            risks: {...risksTranslation, ...(spouseTranslation.spouse?.risks || {}) },
            application: {...applicationTranslation, ...(spouseTranslation.spouse?.application || {}) },
          }
        })
    })
    setIsReady(true)

  }, [data, setFormTranslationForLang, addResourceBundle, removeResourceBundle, reloadResources, setIsReady, setCommon])

  return { isReady }

}
