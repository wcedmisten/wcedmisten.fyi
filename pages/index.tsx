import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ListGroup } from 'react-bootstrap'
import PostItem from '../components/PostItem'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>wcedmisten.fyi</title>
        <meta name="description" content="William Edmisten's Developer Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Posts</h1>
        <ListGroup variant="flush">
          <PostItem
              href="/post/dashcam-to-openstreetmap"
              thumbnailURL="/dashcam-to-openstreetmap/thumbnail.png"
              title="Integrating Dashcam Data with Openstreetmap"
              description='Searching for OpenStreetMap features with dashcam imagery enhanced with OCR.'
              date='June 8, 2022'/>
        </ListGroup>
      </main>
    </div >
  )
}

export default Home
