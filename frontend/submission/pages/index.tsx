import type { NextPage } from 'next'
import Head from 'next/head'
import FormGeneral from '../components/forms/FormGeneral'
import FormRisks from '../components/forms/FormRisks'
import FormApplication from '../components/forms/FormApplication'
import FormFellowApplicants from '../components/forms/FormFellowApplicants'
//import LanguageSelection from "../components/LanguageSelection"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Afg Escape</title>
      </Head>

      <main>
        {/*<LanguageSelection />*/}
        <FormGeneral/>
        <FormRisks/>
        <FormApplication/>
        <FormFellowApplicants/>
      </main>

    </div>
  )
}

export default Home
