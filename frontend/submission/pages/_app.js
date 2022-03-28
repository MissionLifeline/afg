import '../styles/globals.scss'

import {ThemeProvider} from '@mui/styles'

import {AppQueryClientProvider} from '../api'
import {afgTheme} from '../themes'

function MyApp({ Component, pageProps }) {
  return <ThemeProvider theme={afgTheme}>
    <AppQueryClientProvider>
      <Component {...pageProps} />
    </AppQueryClientProvider>
  </ThemeProvider>
}

export default MyApp
