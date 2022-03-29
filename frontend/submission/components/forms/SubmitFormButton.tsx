import {Error,Send,Check,Lock,Pending} from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation } from 'react-query'

import {config} from '../../config'
import {useArmoredDatastore} from '../../state'

type SubmitFormButtonProps = Record<string, never>

const SubmitFormButton = ({}: SubmitFormButtonProps) => {
  const {t} = useTranslation()
  const { formData, sendFormData } = useArmoredDatastore()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [formData, setSubmitted])

  const { mutate, isIdle, isLoading, isSuccess, isError } = useMutation('upload-form', sendFormData)

  useEffect(() => {
    setSubmitted(!!isSuccess)
  }, [isSuccess])

  const startIcon = isLoading ? <Pending/> :
    isSuccess ? <Check/> :
    isError ? <Error/> :
    <Send/>
  // @ts-ignore
  return <Button startIcon={startIcon}
    color={ !isError ?  'success' : 'error'}
    variant={'contained'}
    disabled={isLoading}
    onClick={() => {mutate({variables: {formData}})}}
  >{
    submitted ? t('submitted') : t('submit')
  }</Button>
}

export default SubmitFormButton
