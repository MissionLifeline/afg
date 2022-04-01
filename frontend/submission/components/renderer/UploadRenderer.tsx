import {JsonSchema} from '@jsonforms/core'
import {withJsonFormsControlProps} from '@jsonforms/react'
import {Box, Hidden} from '@mui/material'
import React, {useCallback, useMemo} from 'react'

import {ID, useArmoredDatastore} from '../../state'
import AddAttachmentButton from '../forms/AddAttachmentButton'
import AttachmentsList from '../forms/AttachmentsList'

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
  const uploadIDs = useMemo(() =>
    isArray && data
      ? data.filter((d: any) => typeof d === 'string') as string[]
      : typeof data === 'string'
        ? data.split(',')
        : [], [data, isArray])

  const setUploadIDs = useCallback(
    (ids: string[]) => {
      isArray
        ? handleChange(path, ids)
        : handleChange(path, ids[0])
    },
    [path, handleChange, isArray])

  const {attachments} = useArmoredDatastore()
  const ownAttachmentStates = useMemo(() => attachments.filter(({id}) => uploadIDs.includes(id)), [attachments, uploadIDs])


  const handleAddUploadIDs = useCallback(
    (ids: ID[]) => {
      setUploadIDs([...uploadIDs, ...ids])
    }, [uploadIDs, setUploadIDs])

  const handleDelete = useCallback(
    (id: ID) => {
      setUploadIDs(uploadIDs.filter((_id) => _id !== id))
    },
    [uploadIDs, setUploadIDs])


  return <Hidden xsUp={!visible}>
    <Box style={{marginTop: '1em'}}>
      <AddAttachmentButton ids={uploadIDs} onUploadsAdded={handleAddUploadIDs} multiple={isArray} label={label}
                           uploadCount={ownAttachmentStates.length}/>
      <AttachmentsList attachmentStates={ownAttachmentStates} onDeleteItem={handleDelete}/>
    </Box>
  </Hidden>
}

export default withJsonFormsControlProps(UploadRenderer)
