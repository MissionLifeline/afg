import {Send, WarningAmber} from '@mui/icons-material'
import {Box, FormControl, IconButton, Paper, TextField, Typography} from '@mui/material'
import {grey} from '@mui/material/colors'
import type {NextPage} from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import React, {useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'

import {CustomAppBar} from '../components/layout'
import {LanguageSelection} from '../components/user'


const TokenInvalid: NextPage = () => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const [token, setToken] = useState(query.token || '')

  const openWithToken = useCallback(
    () => {
      push(`/?token=${token}`)
    },
    [token, push])

  return <div className={'wrapper'}>
    <Head>
      <title>Afg Escape</title>
    </Head>
    <CustomAppBar>
      <LanguageSelection/>
    </CustomAppBar>
    <Box
      style={{minHeight: '50vh'}}
      display='flex'
      flexDirection='column'
      alignContent={'space-around'}
      justifyContent={'center'}
    >
      <Paper elevation={3} sx={{backgroundColor: grey[100]}}>
        <Box display={'flex'} flexDirection={'row'} justifyContent='center'>
          <Box textAlign='center'
               sx={theme => ({backgroundColor: theme.palette.error.main, width: '100%', padding: '1em'})}>
            <WarningAmber  sx={{fontSize: '4rem', color: 'white'}} />
          </Box>
        </Box>
        <Box textAlign='center' sx={{padding: '1em'}}>
          <Typography variant='h4'>{t('invalid_token')}</Typography>
          <Typography variant='body1'>{t('enter_valid_token')}</Typography>
        </Box>
        <Box textAlign='center' sx={{padding: '1em'}}>
          <form onSubmit={openWithToken}>
          <FormControl>
            <TextField label={'token'} value={token} onChange={e => setToken(e.target.value)}/>
          </FormControl>
          <IconButton type={'submit'}><Send/></IconButton>
          </form>
        </Box>

      </Paper>
    </Box>

  </div>

}

export default TokenInvalid
