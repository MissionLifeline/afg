import {withJsonFormsControlProps} from '@jsonforms/react'
import {Box} from '@mui/material'
import React, {useCallback, useMemo} from 'react'

import {ID, useArmoredDatastore} from '../../state'
import AddAttachmentButton from '../forms/AddAttachmentButton'
import AttachmentsList from '../forms/AttachmentsList'

type UploadRendererProps = {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const UploadRenderer = ({data, handleChange, path}: UploadRendererProps) => {
  //const [uploadIDs, setUploadIDs] = useState<ID[]>()
  const uploadIDs = useMemo(() =>
      (data as string)?.split(',') || [], [data])

  const { attachments } = useArmoredDatastore()

  const handleAddUploadIDs = useCallback(
    (ids: ID[]) => {
      handleChange( path, [...uploadIDs, ...ids].join(','))
    },
    [path, uploadIDs, handleChange])


  return <Box>
    <AddAttachmentButton onUploadsAdded={handleAddUploadIDs} />
    <AttachmentsList attachmentStates={attachments.filter(({id}) => uploadIDs.includes(id))} />
  </Box>
}

export default withJsonFormsControlProps(UploadRenderer)
