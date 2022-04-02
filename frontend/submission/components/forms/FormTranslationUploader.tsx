import {Check, WarningAmber} from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback} from 'react'
import {useTranslation} from 'react-i18next'

import {useWrite_TranslationMutation} from '../../api/generates'

type FormTranslationUploaderProps ={
  language: string,
  getAllTranslations: () => any
}

const FormTranslationUploader = ({language, getAllTranslations}: FormTranslationUploaderProps) => {
  const {t} = useTranslation('translationHelper')

  const {mutateAsync: writeTranslation, isSuccess, isError} = useWrite_TranslationMutation()

  const handleUploadMutation = useCallback(
    async () => {
      await writeTranslation({
        translationInput: {
          currentSelectedLanguage: language,
          allTranslations: getAllTranslations()
        }
      })

    },
    [writeTranslation, getAllTranslations, language],
  )


  return <Button onClick={handleUploadMutation}
                 endIcon={isError ? <WarningAmber/> : isSuccess ? <Check/> : null}>{t('upload_translation')}</Button>
}

export default FormTranslationUploader
