import {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useQuery} from 'react-query'

import {fetcher} from '../api/fetcher'
import {isFormNamespace, stripFormPrefix} from '../i18n'
import {useTranslationState} from './useTranslationState'


export const useLanguageService = () => {
  const { data } = useQuery(
    'get_translations',
    fetcher<{get_translations: { str: string}}, void>('{get_translations {str}}'),
    { staleTime: Infinity, refetchOnWindowFocus: false})
  const {
    i18n: {addResourceBundle, removeResourceBundle, reloadResources}
  } = useTranslation()
  const {setFormTranslationForLang} = useTranslationState()
  useEffect(() => {
    console.log('invalidated')
      if(!data) return
      let trans
      try {
        trans = JSON.parse(data.get_translations.str)
      } catch (e) {
        return
      }
      if(!trans.allTranslations) return
      Object.entries(trans.allTranslations).forEach(([language, nsData]) => {
        typeof nsData === 'object' && nsData && Object.entries(nsData).forEach(([ns, translation]) => {
          if(typeof translation === 'object' && translation) {
            console.log(ns)
            removeResourceBundle(language, ns)
            addResourceBundle(language, ns, translation, undefined, true)
            reloadResources(language, ns)
            if(isFormNamespace(ns)) {
              const formName = stripFormPrefix(ns)
              console.log('formName', formName)
              setFormTranslationForLang(formName, language, translation)
            }
          }
        })
      })

  }, [data, setFormTranslationForLang, addResourceBundle, removeResourceBundle, reloadResources])

}
