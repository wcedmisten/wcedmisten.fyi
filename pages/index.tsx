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
            href="/post/dashcam-to-speed-limits"
            thumbnailURL="/thumbnails/dashcam-to-speed-limits.jpg"
            thumbnailAlt="Dashcam image containing speed limit sign"
            title="Find Missing Speed Limits in Openstreetmap from Dashcam Footage"
            description='Find Missing Speed Limits using a pipeline with OCR and PostGIS'
            date='June 25, 2022' />
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
