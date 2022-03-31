import log from 'loglevel'
import type { NextPage } from 'next'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {FormWizard} from '../components/forms/FormWizard'
import {WizardStepper} from '../components/forms/WizardStepper'
import { CustomAppBar } from '../components/layout'
import PageFooter from '../components/layout/PageFooter'
import { LanguageSelection } from '../components/user'
import {useTokenStore} from '../state'
import {isDevelopment} from '../utils'

const Home: NextPage = () => {
  const {query, isReady} = useRouter()
  const {token} = query
  const {setToken} = useTokenStore()

  useEffect(() => {
    isReady && typeof(token) === 'string' && setToken(token)
  }, [token, isReady, setToken])

  useEffect(() => {
    isDevelopment() && log.setLevel('debug')
  }, [])


  return (
    <div className={'wrapper'}>
      <Head>
        <title>Afg Escape</title>
      </Head>

      <CustomAppBar>
        <LanguageSelection />
      </CustomAppBar>

      <main>
        <WizardStepper />
        <FormWizard />
      </main>

      <div className={'footer'}>
        <PageFooter />
      </div>

    </div>
  )
}

export default Home
