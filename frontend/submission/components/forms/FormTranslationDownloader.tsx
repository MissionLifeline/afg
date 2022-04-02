import {Button} from '@mui/material'
import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {useTranslationState} from '../../state'

type FormTranslationDownloaderProps ={
  language: string,
  getAllTranslations: () => any
}

const FormTranslationDownloader = ({language, getAllTranslations}: FormTranslationDownloaderProps) => {
  const {t} = useTranslation('translationHelper')
  const {formTranslation} = useTranslationState()
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>()

  const prepareDownload = useCallback(() => {
    const jsonString = JSON.stringify( getAllTranslations(), null, 2)
    const blob = new Blob([jsonString], {type: 'application/json;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    setDownloadUrl(url)

  },  [getAllTranslations])

  useEffect(() => {
    setDownloadUrl(undefined)
  }, [formTranslation])



  return <Button
    download={`form-translations-${language}.json`}
    href={downloadUrl || ''}
    target='_blank' onClick={downloadUrl ? undefined : (e) => {
    e.preventDefault()
    prepareDownload()
  }}>{!downloadUrl ? t('prepare_download') : t('download_now')}</Button>
}

export default FormTranslationDownloader
