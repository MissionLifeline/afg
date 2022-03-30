import ArticleIcon from '@mui/icons-material/Article'
import ErrorIcon from '@mui/icons-material/Error'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import {AttachmentStatus,useArmoredDatastore} from '../../state'

const statusToProgress = (status: AttachmentStatus) => {
  switch(status) {
    case AttachmentStatus.NEW:
      return <LinearProgress variant="determinate" value={0}/>
    case AttachmentStatus.UPLOADING:
      return <LinearProgress variant="determinate" value={50}/>
    case AttachmentStatus.DONE:
      return <LinearProgress variant="determinate" value={100}/>
    case AttachmentStatus.ERROR:
      return 'Error'
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

const AttachmentsList = ({}) => {
  const { attachments } = useArmoredDatastore()

  return <List>{
    attachments.map(({ id, blob, status }) => (
      <ListItem key={id}>
        <ListItemAvatar>
          <Avatar>
            {statusToIcon(status)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={blob.name} secondary={statusToProgress(status)}/>
      </ListItem>
    ))
  }</List>
}

export default AttachmentsList
