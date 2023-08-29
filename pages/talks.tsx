import { ListGroup } from "react-bootstrap";
import PostItem from "../components/PostItem";

function TalksPage() {
    return (
        <div className="post-wrapper">
            <h1 className="post-title">Conference Talks</h1>
            <ListGroup variant="flush">
                <PostItem
                    href="https://www.youtube.com/watch?v=BU0oJBljc4I"
                    thumbnailURL="/og-images/north-america-hospital-distance.png"
                    thumbnailAlt="A map of North America showing the drive time to the nearest hospital."
                    title="Mapping Hospital Accessibility with OpenStreetMap (SOTMUS 2023)"
                    description={
                        <>
                            Analyzing hospital accessibility using OSM and creating an interactive visualization of the data.
                            Given at State of the Map US 2023.{' '}
                            <a href="/slides/mapping_hospital_accessibility_slides.pdf">Slides.</a>{' '}
                            <a href="/post/visualizing-hospital-accessibility/">Original post.</a>
                        </>
                    }
                    date='2023-06-09'
                    location={<a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/?mlat=37.54740&mlon=-77.45433#map=19/37.54740/-77.45433">Richmond, VA</a>} />
            </ListGroup>
        </div >
    )
}

export default TalksPage
