import { ListGroup } from "react-bootstrap";
import PostItem from "../components/PostItem";

function ArtPage() {
    return (
        <div className="post-wrapper">
            <h1 className="post-title">Generative art. Refresh to get a different one!</h1>
            <ListGroup variant="flush">
                <PostItem
                    href="https://wcedmisten.github.io/genart/pulleys/"
                    thumbnailURL="/thumbnails/pulleys.png"
                    thumbnailAlt="Pulleys inspired by Piet Mondrian"
                    title="Pulleys"
                    description='A system of pulleys inspired by Piet Mondrian.'
                    date='2022-06-12' />

                <PostItem
                    href="https://wcedmisten.github.io/genart/sunset/"
                    thumbnailURL="/thumbnails/sunset.png"
                    thumbnailAlt="An Appalachian sunset"
                    title="Sunset"
                    description='An Appalachian sunset.'
                    date='2021-08-15' />
            </ListGroup>
        </div >
    )
}

export default ArtPage
