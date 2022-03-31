import {Check,Lock,Pending,Send} from '@mui/icons-material'
import * as Icons from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation } from 'react-query'

import {config} from '../../config'
import {useArmoredDatastore,useTokenStore} from '../../state'

type SubmitFormButtonProps = Record<string, never>

const SubmitFormButton = ({}: SubmitFormButtonProps) => {
  const {t} = useTranslation()
  const {token} = useTokenStore()
  const { formData, sendFormData } = useArmoredDatastore()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [formData, setSubmitted])

  const { mutate, isIdle, isLoading, isSuccess, isError } = useMutation('upload-form', async () => {
    if (token) {
      return await sendFormData(token)
    } else {
      throw new Error('no token')
    }
  })

  useEffect(() => {
    setSubmitted(!!isSuccess)
  }, [isSuccess])

  const endIcon = isLoading ? <Pending/> :
    isSuccess ? <Check/> :
    isError ? <Icons.Error/> :
    <Send/>
  // @ts-ignore
  return <Button endIcon={endIcon}
    color={ isIdle ? 'primary' : !isError ?  'success' : 'error'}
    variant='contained'
    disabled={isLoading}
    onClick={() => {mutate()}}
  >{
    submitted ? t('submitted') : t('submit')
  }</Button>
}

export default SubmitFormButton
