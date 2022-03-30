import ArticleIcon from '@mui/icons-material/Article'
import ErrorIcon from '@mui/icons-material/Error'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {useTranslation} from 'react-i18next'

import {AttachmentState, AttachmentStatus, useArmoredDatastore} from '../../state'

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

const AttachmentEntry = ({ id, blob, status }: AttachmentState) => {
  const {t} = useTranslation()
  return <ListItem>
    <ListItemAvatar>
      <Avatar>
        {statusToIcon(status)}
      </Avatar>
    </ListItemAvatar>
    <ListItemText primary={blob.name} secondary={statusToProgress(t, status)}/>
  </ListItem>
}

const AttachmentsList = ({}) => {
  const { attachments } = useArmoredDatastore()

  return <List>
    {attachments.map(({ id, blob, status }) =>
      <AttachmentEntry key={id} id={id} blob={blob} status={status}/>
    )}
  </List>
}

export default AttachmentsList
