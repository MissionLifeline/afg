import {Button} from '@mui/material'
import React, {useCallback, useRef} from 'react'
import {useTranslation} from 'react-i18next'

import {ID, useArmoredDatastore, useTokenStore} from '../../state'

type AddAttachementButtonProps = {
  onUploadsAdded?: (id: ID[]) => void,
  label?: string,
  uploadCount?: number
  ids?: ID[]
}

const AddAttachmentButton = ({onUploadsAdded, label, uploadCount = 0, ids = [], ...inputProps}: AddAttachementButtonProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const {t} = useTranslation()
  const {token, userId} = useTokenStore()
  const { addAttachment, addOrReplaceAttachment } = useArmoredDatastore()

  const inputEl = useRef<HTMLInputElement | null>(null)
  const onInputChange = useCallback( () => {
    const files = inputEl?.current?.files
    if (!files || !files.length) {
      console.error('missing files')
      return
    }
    if (!token || !userId) {
      console.error('missing token or userId')
      return
    }

    const uploadedIDs = Array.from(files).map(file => (ids?.[0] && !inputProps.multiple) ? addOrReplaceAttachment(token, userId, ids[0], file) :  addAttachment(token, userId, file))
    onUploadsAdded && onUploadsAdded(uploadedIDs)
  }, [onUploadsAdded, addAttachment, addOrReplaceAttachment, token, userId, inputEl, ids])

  return ( <>
    <Button onClick={() => inputEl.current?.click()} variant='outlined'>
      { label ? (!inputProps.multiple && uploadCount > 0 ? t('attachment.replace', {label}) : t('attachment.add', {label})) : t('attachment.add_document')}
    </Button>
    <input {...inputProps} type="file" ref={inputEl} style={{ display: 'none' }}
       onChange={onInputChange}
    />
  </> )
}

export default AddAttachmentButton
