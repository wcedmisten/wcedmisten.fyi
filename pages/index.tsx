import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>wcedmisten.fyi</title>
        <meta name="description" content="William Edmisten's Developer Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to wcedmisten.fyi
        </h1>
      </main>
    </div >
  )
}

export default Home
