import type { NextPage } from 'next'

import { ListGroup } from 'react-bootstrap'
import PostItem from '../components/PostItem'

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <h1>Posts</h1>
        <ListGroup variant="flush">
          <PostItem
            href="/post/dashcam-to-openstreetmap"
            thumbnailURL="/thumbnails/dashcam-to-openstreetmap.png"
            thumbnailAlt="Dashcam screenshots visualized over openstreetmap"
            title="Integrating Dashcam Data with Openstreetmap"
            description='Searching for OpenStreetMap features with dashcam imagery enhanced with OCR.'
            date='June 8, 2022' />
        </ListGroup>
      </main>
    </div >
  )
}

export default Home
