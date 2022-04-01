import {CheckCircle, Info} from '@mui/icons-material'
import {Box, Paper, Typography} from '@mui/material'
import {blue, green, grey} from '@mui/material/colors'
import React from 'react'
import {useTranslation} from 'react-i18next'

import {useArmoredDatastore,useSubmittedStore} from '../../state'
import AttachmentsList from './AttachmentsList'
import SubmitFormButton from './SubmitFormButton'

const FinalControlStep = () => {
  const {t} = useTranslation()
  const { attachments, removeAttachment } = useArmoredDatastore()
  const {submitted} = useSubmittedStore()

  return <Box
      style={{minHeight: '50vh'}}
      display='flex'
      flexDirection='column'
      alignContent={'space-around'}
      justifyContent={'center'}
    >

      <Paper elevation={3} sx={{backgroundColor: grey[100]}}>
        <Box display={'flex'} flexDirection={'row'} justifyContent='center'>
          <Box textAlign='center' sx={{backgroundColor: !submitted ? blue[500] : green[500], width: '100%', padding: '1em'}}>
            {submitted ? <CheckCircle sx={{fontSize: '4rem', color: 'white'}}/> : <Info  sx={{fontSize: '4rem', color: 'white'}} />}
          </Box>
        </Box>
        <Box textAlign='center' sx={{padding: '1em'}}>
          <Typography variant='h4'>{submitted ? t('success_submit') : t('almost_done')}</Typography>
          <Typography variant='body1'>{submitted ? t('success_received') : t('check_uploads')}</Typography>
        </Box>
        <Box textAlign='center' sx={{padding: '1em'}}>
          <SubmitFormButton/>
        </Box>

        <AttachmentsList attachmentStates={attachments} onDeleteItem={removeAttachment}/>

      </Paper>

    </Box>
}

export default FinalControlStep
