import {Send} from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation } from 'react-query'

import {config} from '../../config'
import {useArmoredDatastore} from '../../state'

type SubmitFormButtonProps = Record<string, never>

const SubmitFormButton = ({}: SubmitFormButtonProps) => {
  const {t} = useTranslation()
  const { encryptedFormData } = useArmoredDatastore()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [encryptedFormData, setSubmitted])


  const prepareBody = useCallback(
    () => {
      const formData = new FormData()
      // @ts-ignore
      formData.append('token', "TODOMyToken")
      formData.append('userId', "TODOmock")
      formData.append('formData', new Blob([encryptedFormData]))
      return formData
    },
    [encryptedFormData])


  const { mutate, data, isSuccess  } = useMutation('upload-form', async () =>
    fetch(`${config.backend_base_url}/api/upload-form`, {
      method: 'POST',
      body: prepareBody()
    }))

  useEffect(() => {
    setSubmitted(!!(isSuccess && data))
  }, [isSuccess, data])


  // @ts-ignore
  return <Button color={ submitted  ?  'success' : 'error'} variant={'outlined'} startIcon={<Send />} onClick={() => {mutate({variables: {formData: encryptedFormData}})}} >{
    submitted ? t('submitted') : t('submit')
  }</Button>
}

export default SubmitFormButton
