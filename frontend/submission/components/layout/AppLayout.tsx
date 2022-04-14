import Head from 'next/head'
import React, { FunctionComponent } from 'react'

import {LanguageSelection} from '../user'
import {CustomAppBar} from './CustomAppBar'
import PageFooter from './PageFooter'

interface OwnProps {
    children: React.ReactChild | React.ReactChildren
}

type Props = OwnProps;

const AppLayout: FunctionComponent<Props> = ({ children }) => {

  return (
      <div className={'wrapper'}>
          <Head>
              <title>Afg Escape</title>
          </Head>

          <CustomAppBar>
              <LanguageSelection />
          </CustomAppBar>

          <main>
              {children}
          </main>

          <div className={'footer'}>
              <PageFooter />
          </div>

      </div>
  )
}

export default AppLayout
