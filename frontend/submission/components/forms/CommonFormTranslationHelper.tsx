import React, {FunctionComponent, useEffect} from 'react'
import {useTranslation} from 'react-i18next'

import {useTranslationState} from '../../state'
import FormTranslationHelper from './FormTranslationHelper'


const CommonFormTranslationHelper: FunctionComponent = () => {
  const { i18n: {language, getResourceBundle}} = useTranslation()
  const {common, setCommon} = useTranslationState()
  useEffect(() => {
    if(!common[language])
      setCommon(language, getResourceBundle(language, 'common'))
  }, [language, getResourceBundle, common, setCommon])
  return <FormTranslationHelper
      name='common'
      language={language}
      translationData={common[language]}
      onTranslationChange={({data}) => setCommon(language, data)}
  />
}

export default CommonFormTranslationHelper
