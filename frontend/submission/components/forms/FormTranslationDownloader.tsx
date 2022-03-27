import {Button} from '@mui/material'
import log from 'loglevel'
import React, {useCallback, useEffect, useState} from 'react'

import {formNamespace, fromTranslationStateToFormTranslation} from '../../i18n'
import {useTranslationState} from '../../state'

type FormTranslationDownloaderProps = Record<string, never>

const FormTranslationDownloader = ({}: FormTranslationDownloaderProps) => {
  const {formTranslation} = useTranslationState()
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>()

  const prepareDownload = useCallback(() => {
    const formTranslationFolded = fromTranslationStateToFormTranslation(
      Object.fromEntries(Object.entries(formTranslation)
        .map(([k, v]) => [formNamespace(k), v])))
    //console.log({formTranslationFolded})
    const jsonString = JSON.stringify(formTranslationFolded, null, 2)
    const blob = new Blob([jsonString], {type: 'application/json;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    setDownloadUrl(url)

  }, [formTranslation])

  useEffect(() => {
    log.debug('effect')
    setDownloadUrl(undefined)
  }, [formTranslation])



  return <Button
    download='form-translations.json'
    href={downloadUrl || ''}
    target='_blank' onClick={downloadUrl ? undefined : (e) => {
    e.preventDefault()
    prepareDownload()
  }}>{!downloadUrl ? 'prepare download' : 'download now'}</Button>
}

export default FormTranslationDownloader
