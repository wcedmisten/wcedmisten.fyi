import { ListGroup } from "react-bootstrap";
import PostItem from "../components/PostItem";

function ArtPage() {
    return (
        <div>
            <main>
                <h1>Generative art. Refresh to get a different one!</h1>
                <ListGroup variant="flush">
                    <PostItem
                        href="https://wcedmisten.github.io/genart/pulleys/"
                        thumbnailURL="/thumbnails/pulleys.png"
                        thumbnailAlt="Pulleys inspired by Piet Mondrian"
                        title="Pulleys"
                        description='A system of pulleys inspired by Piet Mondrian'
                        date='June 12, 2022' />

                    <PostItem
                        href="https://wcedmisten.github.io/genart/sunset/"
                        thumbnailURL="/thumbnails/sunset.png"
                        thumbnailAlt="An Appalachian sunset"
                        title="Sunset"
                        description='An Appalachian sunset.'
                        date='August 15, 2021' />
                </ListGroup>
            </main>
        </div >
    )
}

export default ArtPage
