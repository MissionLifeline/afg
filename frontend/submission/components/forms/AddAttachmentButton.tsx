import {Button} from '@mui/material'
import React, { useRef } from 'react'
import {useTranslation} from 'react-i18next'

import {ID, useArmoredDatastore} from '../../state'

type AddAttachementButtonProps = {
  onUploadsAdded?: (id: ID[]) => void
}

const AddAttachmentButton = ({onUploadsAdded}: AddAttachementButtonProps) => {
  const {t} = useTranslation()
  const { addAttachment } = useArmoredDatastore()

  const inputEl = useRef<HTMLInputElement | null>(null)
  const onInputChange = () => {
    const files = inputEl?.current?.files
    if (!files || !files.length) {
      return
    }

    const uploadedIDs = Array.from(files).map(file =>  addAttachment(file))
    onUploadsAdded && onUploadsAdded(uploadedIDs)
  }

  return ( <>
    <Button onClick={() => inputEl.current?.click()}>{t('attachment.add')}</Button>
    <input type="file" multiple ref={inputEl} style={{ display: 'none' }}
       onChange={onInputChange}
    />
  </> )
}

export default AddAttachmentButton
