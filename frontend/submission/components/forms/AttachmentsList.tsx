import {Delete} from '@mui/icons-material'
import ArticleIcon from '@mui/icons-material/Article'
import ErrorIcon from '@mui/icons-material/Error'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {IconButton} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {useTranslation} from 'react-i18next'

import {AttachmentState, AttachmentStatus, ID} from '../../state'

const statusToProgress = (t: (s: string) => string, status: AttachmentStatus) => {
  switch(status) {
    case AttachmentStatus.NEW:
      return <LinearProgress variant="determinate" value={0}/>
    case AttachmentStatus.UPLOADING:
      return <LinearProgress variant="determinate" value={50}/>
    case AttachmentStatus.DONE:
      return <LinearProgress variant="determinate" value={100}/>
    case AttachmentStatus.ERROR:
      return t('error.transfer')
  }
}

const statusToIcon = (status: AttachmentStatus) => {
  switch(status) {
    case AttachmentStatus.NEW:
      return <ArticleIcon/>
    case AttachmentStatus.UPLOADING:
      return <UploadFileIcon/>
    case AttachmentStatus.DONE:
      return <ArticleIcon/>
    case AttachmentStatus.ERROR:
      return <ErrorIcon/>
  }
}

type AttachmentEntryProps = {
  onDeleteItem: (id: ID) => void
}

const AttachmentEntry = ({id,  blob, status, onDeleteItem }:  AttachmentEntryProps & AttachmentState) => {
  const {t} = useTranslation()
  return <ListItem secondaryAction={
    <IconButton edge="end" aria-label={t('delete')} onClick={() => onDeleteItem(id)}>
      <Delete />
    </IconButton>
  }>
    <ListItemAvatar>
      <Avatar>
        {statusToIcon(status)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={blob.name} secondary={statusToProgress(t, status)}/>
  </ListItem>
}

type AttachementListProps = {
  attachmentStates: AttachmentState[]
} & AttachmentEntryProps

const AttachmentsList = ({attachmentStates, ...entryProps}: AttachementListProps) =>
  <List>
    {attachmentStates.map(({id, blob, status}) =>
      <AttachmentEntry key={id} id={id} blob={blob} status={status} {...entryProps}/>
    )}
  </List>

export default AttachmentsList
