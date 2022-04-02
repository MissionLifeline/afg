import {Check, WarningAmber} from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback} from 'react'
import {useTranslation} from 'react-i18next'

import {useWrite_TranslationMutation} from '../../api/generates'
import {formNamespace, fromTranslationStateToFormTranslation} from '../../i18n'
import {useTranslationState} from '../../state'

type FormTranslationUploaderProps ={
  language: string
}

const FormTranslationUploader = ({language}: FormTranslationUploaderProps) => {
  const {t} = useTranslation('translationHelper')
  const {formTranslation} = useTranslationState()

  const {mutateAsync: writeTranslation, isSuccess, isError} = useWrite_TranslationMutation()

  const handleUploadMutation = useCallback(
    async () => {
      const formTranslationFolded = fromTranslationStateToFormTranslation(
        Object.fromEntries(Object.entries(formTranslation)
          .map(([k, v]) => [formNamespace(k), v])))
      await writeTranslation({
        translationInput: {
          currentSelectedLanguage: language,
          allTranslations: formTranslationFolded
        }
      })

    },
    [writeTranslation, formTranslation, language],
  )


  return <Button onClick={handleUploadMutation}
                 endIcon={isError ? <WarningAmber/> : isSuccess ? <Check/> : null}>{t('upload_translation')}</Button>
}

export default FormTranslationUploader
