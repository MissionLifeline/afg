import {CheckCircle, Info} from '@mui/icons-material'
import {Box, Divider, Paper, Typography} from '@mui/material'
import {blue, green, grey} from '@mui/material/colors'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {resources} from '../../i18n'
import {useTokenStore, useSubmittedStore} from '../../state'
import {useIs_TranslatorQuery} from '../../api/generates'
import FormTranslationHelper from './FormTranslationHelper'
import SubmitFormButton from './SubmitFormButton'

const FinalControlStep = () => {
  const {t, i18n: {language}} = useTranslation()
  const {submitted} = useSubmittedStore()
  const {token, userId} = useTokenStore()
  const {data: data_is_translator} = useIs_TranslatorQuery({auth: {token, userId}},
    {
      enabled: Boolean(token && userId),
      staleTime: 60 * 60 * 1000
    })
  const enableTranslationHelper = data_is_translator?.is_translator

  const [commonTranslation, setCommonTranslation] = useState((resources as any)[language]?.common || resources.en.common)

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
      </Paper>
    {enableTranslationHelper && <>
      <Divider style={{marginTop: '2em', marginBottom: '2em'}}/>
      <FormTranslationHelper
        injectToCurrentLang
        name={'common'}
        language={language}
        translationData={commonTranslation}
        onTranslationChange={({data}) => setCommonTranslation( data)}
      /></>}

  </Box>
}

export default FinalControlStep
