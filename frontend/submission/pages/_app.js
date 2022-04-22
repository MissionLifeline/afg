import '../styles/globals.scss'

import {ThemeProvider} from '@mui/styles'
import log from 'loglevel'
import {useEffect} from 'react'

import {AppQueryClientProvider} from '../api'
import { TranslationLoader } from '../i18n'
import {afgTheme} from '../themes'
import {isDevelopment} from '../utils'

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    isDevelopment() && log.setLevel('debug')
  }, [])
  return <ThemeProvider theme={afgTheme}>
    <AppQueryClientProvider>
      <TranslationLoader />
      <Component {...pageProps} />
    </AppQueryClientProvider>
  </ThemeProvider>
}

export default MyApp
