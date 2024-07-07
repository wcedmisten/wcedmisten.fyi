import { ListGroup } from "react-bootstrap";
import PostItem from "../components/PostItem";

function ProjectsPage() {
    return (
        <div className="post-wrapper">
            <h1 className="post-title">Projects</h1>
            <ListGroup variant="flush">
                <PostItem
                    href="/project/cville-planned-sidewalks"
                    thumbnailURL="/og-images/cville-planned-sidewalks.png"
                    thumbnailAlt="A map showing planned sidewalks in Charlottesville, Virginia."
                    title="Charlottesville Planned Sidewalks"
                    description="Sidewalks that are planned to be built in Charlottesville from 2024-2030."
                    date='2024-07-07' />
                <PostItem
                    href="/project/virginia-hospital-ownership"
                    thumbnailURL="/og-images/virginia-hospital-ownership.png"
                    thumbnailAlt="A colored map showing hospital ownership in Virginia."
                    title="Virginia Hospital Ownership"
                    description="A visualization of hospital ownership in Virginia derived from OpenStreetMap data."
                    date='2024-03-30' />
                <PostItem
                    href="https://www.510k.fyi"
                    thumbnailURL="/medical-device-analysis/thumbnail.png"
                    thumbnailAlt="A graph of predicate device data"
                    title="510k.fyi"
                    description="A webapp to improve the FDA's 510k medical device database with enhanced predicate device data."
                    date='2024-03-10' />
                <PostItem
                    href="/project/north-america-hospital-distance"
                    thumbnailURL="/og-images/north-america-hospital-distance.png"
                    thumbnailAlt="A map of North America showing the drive time to the nearest hospital."
                    title="North America Hospital Accessibility"
                    description='A map visualizing the travel time by car to the nearest hospital in North America.'
                    date='2023-04-30' />
                <PostItem
                    href="/project/virginia-hospital-distance"
                    thumbnailURL="/og-images/virginia-hospital-distance.png"
                    thumbnailAlt="A map of Virginia showing the drive time to the nearest hospital."
                    title="Virginia Hospital Accessibility Map"
                    description='A map visualizing the travel time by car to the nearest hospital in Virginia. Powered by OpenStreetMap.'
                    date='2023-03-25' />
                <PostItem
                    href="/project/lowPoly/"
                    thumbnailURL="/thumbnails/lowPoly.jpg"
                    thumbnailAlt="A low polygon picture of a sunflower."
                    title="Low Polygon Image Filter"
                    description='Convert images into low-polygon art using Delauney triangulation.'
                    date='2022-09-10' />
                <PostItem
                    href="/project/paintingGuesser/"
                    thumbnailURL="/thumbnails/paintingGuesser.png"
                    thumbnailAlt="Painting of a mouse in a baseball cap."
                    title="Painting Guesser"
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
