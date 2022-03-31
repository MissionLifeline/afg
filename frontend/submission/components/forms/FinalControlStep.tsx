import {CheckCircle} from '@mui/icons-material'
import {Box, Paper, Typography} from '@mui/material'
import { green, grey } from '@mui/material/colors'
import React from 'react'

import {useArmoredDatastore} from '../../state'
import AttachmentsList from './AttachmentsList'
import SubmitFormButton from './SubmitFormButton'


const FinalControlStep = () => {
  const { attachments, removeAttachment } = useArmoredDatastore()
  return <Box
    style={{minHeight: '50vh'}}
    display='flex'
    flexDirection='column'
    alignContent={'space-around'}
    justifyContent={'center'}
  >

    <Paper elevation={3} sx={{backgroundColor: grey[100]}}>
      <Box display={'flex'} flexDirection={'row'} justifyContent='center'>
        <Box textAlign='center' sx={{backgroundColor: green[500], width: '100%', padding: '1em'}}>
          <CheckCircle sx={{fontSize: '4rem', color: 'white'}}/></Box>
      </Box>
      <Box textAlign='center' sx={{padding: '1em'}}>
        <Typography variant='h4'>Almost done ...</Typography>
        <Typography variant='body1'>Please check your uploads and submit finally</Typography>
      </Box>
      <Box textAlign='center' sx={{padding: '1em'}}>
        <SubmitFormButton/>
      </Box>

      <AttachmentsList attachmentStates={attachments} onDeleteItem={removeAttachment}/>

    </Paper>

  </Box>
}

export default FinalControlStep
