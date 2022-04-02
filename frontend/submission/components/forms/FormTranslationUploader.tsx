import {Check, WarningAmber} from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {useQueryClient} from 'react-query'

import {useWrite_TranslationMutation} from '../../api/generates'
import {useTokenStore} from '../../state'

type FormTranslationUploaderProps ={
  language: string,
  getAllTranslations: () => any
}

const FormTranslationUploader = ({language, getAllTranslations}: FormTranslationUploaderProps) => {
  const queryClient = useQueryClient()
  const {t} = useTranslation('translationHelper')
  const {token, userId} = useTokenStore()

  const {mutateAsync: writeTranslation, isSuccess, isError} = useWrite_TranslationMutation({
      onSuccess: () => { queryClient.invalidateQueries('get_translations')}
    })

  const handleUploadMutation = useCallback(
    async () => {
      const result = await writeTranslation({auth: {token, userId},
                                             translationInput: {
                                               currentSelectedLanguage: language,
                                               allTranslations: getAllTranslations()
                                             }
                                            })
      if(!result.write_translations) throw Error('Uploading translations failed')
      // TODO: isError should be true
    },
    [token, userId, writeTranslation, getAllTranslations, language]
  )


  return <Button onClick={handleUploadMutation}
                 endIcon={/*isError ? <WarningAmber/> : isSuccess ? <Check/> :*/ null}>{t('upload_translation')}</Button>
}

export default FormTranslationUploader
