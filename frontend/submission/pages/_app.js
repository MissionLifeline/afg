import '../styles/globals.scss'

import {ThemeProvider} from '@mui/styles'

import {afgTheme} from '../themes'

function MyApp({ Component, pageProps }) {
  return <ThemeProvider theme={afgTheme}>
    <Component {...pageProps} />
  </ThemeProvider>
}

export default MyApp
