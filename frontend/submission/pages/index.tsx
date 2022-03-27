import {Box} from '@mui/material'
import log from 'loglevel'
import type { NextPage } from 'next'
import Head from 'next/head'
import {useEffect} from 'react'

import {FormWizard} from '../components/forms/FormWizard'
import {WizardStepper} from '../components/forms/WizardStepper'
import { CustomAppBar } from '../components/layout'
import { LanguageSelection } from '../components/user'
import {resources} from '../i18n'

const Home: NextPage = () => {

  useEffect(() => {
    log.setLevel('debug')

    log.debug({ translationResources: resources})
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
