import type { NextPage } from 'next'
import Head from 'next/head'
import FormGeneral from '../components/forms/FormGeneral'
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
      </main>

    </div>
  )
}

export default Home
