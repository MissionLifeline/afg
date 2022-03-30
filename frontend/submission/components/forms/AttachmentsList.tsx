import ArticleIcon from '@mui/icons-material/Article'
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
      return 0
    case AttachmentStatus.UPLOADING:
      return 50
    case AttachmentStatus.DONE:
      return 100
  }
}

const AttachmentsList = ({}) => {
  const { attachments } = useArmoredDatastore()

  return <List>{
    attachments.map(({ id, blob, status }) => (
      <ListItem key={id}>
        <ListItemAvatar>
          <Avatar>
            <ArticleIcon/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={blob.name} secondary={
          <LinearProgress variant="determinate" value={statusToProgress(status)}/>
        }/>
      </ListItem>
    ))
  }</List>
}

export default AttachmentsList
