import {Check,Pending,Send} from '@mui/icons-material'
import * as Icons from '@mui/icons-material'
import {Button} from '@mui/material'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation } from 'react-query'

import {useArmoredDatastore, useTokenStore} from '../../state'

type SubmitFormButtonProps = Record<string, never>

const SubmitFormButton = ({}: SubmitFormButtonProps) => {
  const {t} = useTranslation()
  const {token, userId} = useTokenStore()
  const {formDataDirty, sendFormData} = useArmoredDatastore()

  const { mutate, isIdle, isLoading, isSuccess, isError } = useMutation('upload-form', async () => {
    if (token && userId) {
      return await sendFormData(token, userId)
    } else {
      throw new Error('no token or userId')
    }
  })

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
    title='submit'
  >{
    !formDataDirty ? t('submitted') : t('submit')
  }</Button>
}

export default SubmitFormButton
