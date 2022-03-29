import React, { useRef } from 'react'
import {Button} from '@mui/material'
import {useArmoredDatastore} from '../../state'

const AddAttachmentButton = ({}) => {
  const { addAttachment } = useArmoredDatastore()

  const inputEl = useRef()
  const onInputChange = () => {
    const files = inputEl.current.files
    console.log("files", files)
    for(let i = 0; i < files.length; i++) {
      addAttachment(files[i])
    }
  }

  return ( <>
    <Button onClick={() => inputEl.current.click()}>Attach a document</Button>
    <input type="file" multiple ref={inputEl} style={{ display: "none" }}
       onChange={onInputChange}
    />
  </> )
}

export default AddAttachmentButton
