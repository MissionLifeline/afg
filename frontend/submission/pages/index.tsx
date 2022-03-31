import {Box} from '@mui/material'
import log from 'loglevel'
import type { NextPage } from 'next'
import Head from 'next/head'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useTokenStore} from '../state/useTokenStore'

import {FormWizard} from '../components/forms/FormWizard'
import {WizardStepper} from '../components/forms/WizardStepper'
import { CustomAppBar } from '../components/layout'
import { LanguageSelection } from '../components/user'
import {isDevelopment} from '../utils'

const Home: NextPage = () => {
  const {query, isReady} = useRouter()
  const {token} = query
  const {setToken} = useTokenStore()

  useEffect(() => {
    isReady && typeof(token) === 'string' && setToken(token)
  }, [token, isReady])

  useEffect(() => {
    isDevelopment() && log.setLevel('debug')
  }, [])


  return (
    <div>
      <Head>
        <title>Afg Escape</title>
      </Head>

      <CustomAppBar>
        <LanguageSelection />
      </CustomAppBar>

      <main>
        <WizardStepper />
        <Box className={'form_container'}>
          <FormWizard />
        </Box>
      </main>

    </div>
  )
}

export default Home
