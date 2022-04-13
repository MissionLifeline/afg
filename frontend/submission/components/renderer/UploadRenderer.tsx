import {JsonSchema} from '@jsonforms/core'
import {withJsonFormsControlProps} from '@jsonforms/react'
import {Box, Hidden} from '@mui/material'
import React, {useCallback, useMemo} from 'react'

import {ID, useArmoredDatastore} from '../../state'
import AddAttachmentButton from '../forms/AddAttachmentButton'
import AttachmentsList from '../forms/AttachmentsList'

type Upload = {
  id: ID,
  description: string,
  fileName: string,
  fileType: string,
}

type UploadRendererProps = {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  visible?: boolean
}

const UploadRenderer = ({data, handleChange, path, label, schema, visible}: UploadRendererProps) => {
  const isArray = useMemo(() => schema.type === 'array', [schema])
  const uploads = useMemo(() =>
    data
      ? ((isArray ? data : [data]) as Upload[])
      : []
  , [data, isArray])

  const setUploads = useCallback(
    (uploads: Upload[]) => {
      isArray
        ? handleChange( path, uploads)
        : handleChange( path, uploads[0])
    },
    [path, handleChange, isArray])

  const { attachments } = useArmoredDatastore()
  const ownAttachmentStates = useMemo(() => attachments.filter(({id}) => uploads.some(upload => upload.id === id)), [attachments, uploads])


  const handleAddUploads = useCallback(
    (newUploads: { id: ID, fileName: string, fileType: string }[]) => {
      setUploads([
        ...uploads,
        ...newUploads.map(upload => ({ ...upload, description: '' })),
      ])
    }, [uploads, setUploads])

  const handleDelete = useCallback(
    (_id: ID) => {
      setUploads( uploads.filter(({ id }) => _id !== id) )
    },
    [uploads, setUploads])

  const handleChangeDescription = useCallback(
    (id: ID, description: string) => {
      setUploads( uploads.map(upload =>
        upload.id === id
          ? { ...upload, description }
          : upload
      ) )
    },
    [ uploads, setUploads ])

  return <Hidden xsUp={!visible}>
    <Box style={{marginTop: '1em'}}>
      <AddAttachmentButton ids={uploads.map(({ id }) => id)} onUploadsAdded={handleAddUploads} multiple={isArray} label={label} path={path} uploadCount={ownAttachmentStates.length}/>
      <AttachmentsList
        attachmentStates={ownAttachmentStates}
        descriptions={uploads}
        onChangeDescription={handleChangeDescription}
        onDeleteItem={handleDelete}
      />
    </Box>
  </Hidden>
}

export default withJsonFormsControlProps(UploadRenderer)
