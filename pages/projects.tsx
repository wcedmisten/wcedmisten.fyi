import { ListGroup } from "react-bootstrap";
import PostItem from "../components/PostItem";

function ProjectsPage() {
    return (
        <div className="post-wrapper">
            <h1 className="post-title">Projects I've made.</h1>
            <ListGroup variant="flush">
                <PostItem
                    href="/project/paintingGuesser/"
                    thumbnailURL="/thumbnails/paintingGuesser.png"
                    thumbnailAlt="Painting of a mouse in a baseball cap."
                    title="Multiverse Art Gallery Curator"
                    description='Guess the missing plaque information for famous paintings that were made in another timeline. Images generated with stable diffusion.'
                    date='2022-08-28' />
                <PostItem
                    href="/project/foodGraph/"
                    thumbnailURL="/thumbnails/foodGraph.jpg"
                    thumbnailAlt="A network graph of recipes"
                    title="Recipe Graph"
                    description='A network graph visualization of ingredients scraped from 91,000 recipes.'
                    date='2022-08-19' />
                <PostItem
                    href="https://wcedmisten.github.io/genart/pulleys/"
                    thumbnailURL="/thumbnails/pulleys.png"
                    thumbnailAlt="Pulleys inspired by Piet Mondrian"
                    title="Pulleys"
                    description='Generative art. A system of pulleys inspired by Piet Mondrian.'
                    date='2022-06-12' />

                <PostItem
                    href="https://wcedmisten.github.io/genart/sunset/"
                    thumbnailURL="/thumbnails/sunset.png"
                    thumbnailAlt="An Appalachian sunset"
                    title="Sunset"
                    description='Generative art. An Appalachian sunset.'
                    date='2021-08-15' />
            </ListGroup>
        </div >
    )
}

export default ProjectsPage
