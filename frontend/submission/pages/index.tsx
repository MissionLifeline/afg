import {Box} from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'

import FormApplication from '../components/forms/FormApplication'
import FormFellowApplicants from '../components/forms/FormFellowApplicants'
import FormGeneral from '../components/forms/FormGeneral'
import FormRisks from '../components/forms/FormRisks'
import { CustomAppBar } from '../components/layout'
import { LanguageSelection } from '../components/user'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Afg Escape</title>
      </Head>

      <CustomAppBar>
        <LanguageSelection />
      </CustomAppBar>

      <main>
        <Box className={'form_container'}>
          <FormGeneral/>
          <FormRisks/>
          <FormApplication/>
          <FormFellowApplicants/>
        </Box>
      </main>

    </div>
  )
}

export default Home
