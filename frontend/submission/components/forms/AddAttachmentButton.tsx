import {Button} from '@mui/material'
import React, { useRef } from 'react'
import {useTranslation} from 'react-i18next'

import {useArmoredDatastore} from '../../state'

const AddAttachmentButton = ({}) => {
  const {t} = useTranslation()
  const { addAttachment } = useArmoredDatastore()

  const inputEl = useRef<any>()
  const onInputChange = () => {
    const files = inputEl?.current?.files
    if (!files) {
      return
    }

    for(let i = 0; i < files.length; i++) {
      addAttachment(files[i])
    }
  }

  return ( <>
    <Button onClick={() => inputEl.current?.click()}>{t('attachment.add')}</Button>
    <input type="file" multiple ref={inputEl} style={{ display: 'none' }}
       onChange={onInputChange}
    />
  </> )
}

export default AddAttachmentButton
