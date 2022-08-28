import path from 'path';
import { promises as fs } from 'fs';

import style from "../paintingguesser.module.css"
import { Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';

interface GuesserProps {
    pid: string;
    artist: string;
    subject: string;
    description: string;
}

export const Guesser = (props: GuesserProps) => {
    const { pid, artist, subject, description } = props;

    const pictureId = pid;

    const yearRanges: any = {
        'Leonardo da Vinci': [1492, 1519],
        'Vincent van Gogh': [1873, 1890],
        'Francisco Goya': [1776, 1828],
        'Salvador Dali': [1924, 1989],
        'Claude Monet': [1865, 1926]
    };

    const pictureInt: number = parseInt(pictureId?.slice(-8), 16);
    const yearRange: number[] = yearRanges[artist]
    const year: any = yearRange !== undefined ? yearRange[0] + pictureInt % (yearRange[1] - yearRange[0]) : undefined;

    return (
        <>
            <Container className="justify-content-md-center">
                <Row><Col className="justify-content-center text-center">
                    <h1 className={style.Headers}>Art Gallery Curator</h1>
                </Col></Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <div className={style.Frame}>
                            <img className={style.PaintingImage} src={`/projects/painting-guesser/${pictureId}/painting.jpg`}></img>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <div className={style.Plaque}>
                            <h3 className={style.PlaqueText}>{artist}</h3>
                            <p className={style.PlaqueText}>
                                Painting of a {' ' + subject + ' ' + description + ', ' + year + '.'}
                            </p>
                            <p className={style.PlaqueText}><i>Oil on canvas.</i></p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <Link href={"/project/paintingGuesser"}>
                            <a>Back to the game</a>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Guesser

export async function getStaticPaths() {
    const postsDirectory = path.join(
        process.cwd(),
        'public/projects/painting-guesser'
    );
    const filenames = await fs.readdir(postsDirectory);

    const x = await Promise.all(filenames)

    return {
        paths: x.map(f => ({ params: { pid: f } })),
        fallback: false
    };
}

export async function getStaticProps({ params }: { params: any }) {
    const { pid } = params;

    const postsDirectory = path.join(
        process.cwd(),
        'public/projects/painting-guesser'
    );

    const filePath = path.join(postsDirectory, pid)
    const fileContents = await fs.readFile(
        `${filePath}/prompts.txt`,
        'utf8')

    const artist = fileContents.split("painting by ")[1].split(" of a ")[0].replace("vincent van gogh", "Vincent van Gogh");

    const subject = fileContents.split("of a ")[1].split(" ")[0];

    const description = fileContents.split("of a ")[1].split(" --plms")[0].split(' ').slice(1).join(' ')

    return {
        props: {
            pid,
            artist,
            subject,
            description
        }
    };
}