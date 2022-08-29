import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';

import style from "./paintingguesser.module.css"
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { BsFillShareFill } from 'react-icons/bs';

interface GuesserProps {
    solutions: any,
    filenames: string[];
    artists: string[];
    subjects: string[];
    descriptions: string[];
}

type GameStatus = "guessing" | "correct" | "wrong";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
// https://stackoverflow.com/a/46545530
function shuffleArray(array: any[]) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

export const Guesser = (props: GuesserProps) => {
    const { filenames, artists, subjects, descriptions, solutions } = props;

    const [shuffled, setShuffled] = useState<string[] | undefined>(undefined);

    useEffect(() => {
        setShuffled(shuffleArray(filenames));
    }, []);

    const [index, setIndex] = useState<number>(0);

    const pictureId: string | undefined = shuffled !== undefined ? shuffled[index] : "";

    const [selectedArtist, setSelectedArtist] = useState(""); //default value

    function handleArtistSelectChange(event: any) {
        setSelectedArtist(event.target.value);
    }

    const [selectedSubject, setSelectedSubject] = useState(""); //default value

    function handleSubjectSelectChange(event: any) {
        setSelectedSubject(event.target.value);
    }

    const [selectedDescription, setSelectedDescription] = useState(""); //default value

    function handleDescriptionSelectChange(event: any) {
        setSelectedDescription(event.target.value);
    }

    function submitAnswers(event: any) {
        setShowCorrectValues({
            artist: selectedArtist === solution.artist,
            subject: selectedSubject === solution.subject,
            description: selectedDescription === solution.description
        });
        if (answersCorrect) {
            setGameStatus("correct");
        } else {
            setGameStatus("wrong");
        }
    }

    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

    const [showArtistModal, setShowArtistModal] = useState<boolean>(false);

    function resetGame(event: any) {
        setIndex((index + 1) % filenames.length);
        setShowCorrectValues({
            artist: false,
            subject: false,
            description: false
        });
        setCopyButtonText("Share");
        setGameStatus("guessing");
    }

    const [copyButtonText, setCopyButtonText] = useState<string>("Share")

    function copyShareLink(event: any) {
        setCopyButtonText("Copied to clipboard")
        navigator.clipboard.writeText(window.location.href + pictureId);
    }

    const solution = solutions[pictureId];
    const answersCorrect: boolean = selectedArtist === solution?.artist &&
        selectedSubject === solution?.subject &&
        selectedDescription === solution?.description;

    const [showCorrectValues, setShowCorrectValues] = useState<any>({
        artist: false,
        subject: false,
        description: false
    });

    const showSubmitButton: boolean = selectedArtist !== "" && selectedSubject !== "" && selectedDescription !== "";

    const [gameStatus, setGameStatus] = useState<GameStatus>("guessing");
    const buttonClass = {
        "guessing": "btn-primary",
        "correct": "btn-success",
        "wrong": "btn-danger"
    }[gameStatus]

    const buttonText = {
        "guessing": "Engrave Plaque",
        "correct": "Correct!",
        "wrong": "Try Again!",
    }[gameStatus]

    const yearRanges: any = {
        'Leonardo da Vinci': [1492, 1519],
        'Vincent van Gogh': [1873, 1890],
        'Francisco Goya': [1776, 1828],
        'Salvador Dali': [1924, 1989],
        'Claude Monet': [1865, 1926],
        'Rembrandt': [1626, 1668],
        'Andy Warhol': [1948, 1987],
    };

    const pictureInt: number = parseInt(pictureId?.slice(-8), 16);
    const yearRange: number[] = yearRanges[solution?.artist]
    const year: any = yearRange !== undefined ? yearRange[0] + pictureInt % (yearRange[1] - yearRange[0]) : undefined;

    return shuffled !== undefined && (
        <>
            <Modal fullscreen={true} show={showArtistModal} onHide={() => setShowArtistModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>Need a Refresher on Famous Artists?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row><Col className="text-center"><h2>Here are a few famous pieces:</h2></Col></Row>
                        <Row>
                            <Col className="text-center">
                                <p>Mona Lisa, by Leonardo da Vinci</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/mona-lisa.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>The Starry Night, by Vincent van Gogh</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/starry-night.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>Orange Marilyn, by Andy Warhol</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/orange-marilyn.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>The Persistence of Memory, by Salvador Dali</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/persistence-of-memory.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>Waterlillies and Japanese Bridge, by Claude Monet</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/waterlillies-and-japanese-bridge.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>Self Portrait, by Rembrandt</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/rembrandt-self-portrait.jpg"></img>
                            </Col>
                            <Col className="text-center">
                                <p>Saturn Devouring His Son, by Francisco Goya</p>
                                <img className={style.RefresherImage} src="/thumbnails/artist-refreshers/saturn-devouring-his-son.jpg"></img>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="button-lg" variant="secondary" onClick={() => setShowArtistModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container className="justify-content-md-center">
                <Row><Col className="justify-content-center text-center">
                    <h1 className={style.Headers}>Art Gallery Curator</h1>
                    <p className={style.Headers}>Oh no! The plaques for these famous paintings got stolen! Can you fix them?</p>
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
                            <div className={style.PlaqueText}>
                                {showCorrectValues.artist ?
                                    <h3 className={style.PlaqueText}>{solution.artist}</h3> :
                                    <select value={selectedArtist} onChange={handleArtistSelectChange} name="artist">
                                        <option key="placeholder" value="" disabled>Artist</option>
                                        {artists.map((artist: string) => {
                                            return <option key={artist} value={artist}>{artist}</option>
                                        })}
                                    </select>
                                }
                            </div>
                            <p className={style.PlaqueText}>
                                Painting of a {' '}
                                {showCorrectValues.subject ?
                                    solution.subject :
                                    <select value={selectedSubject} onChange={handleSubjectSelectChange} name="subject" id="subject">
                                        <option key="placeholder" value="" disabled>Subject</option>
                                        {subjects.map((subject: string) => {
                                            return <option key={subject} value={subject}>{subject}</option>
                                        })}
                                    </select>
                                }
                                {' '}
                                {showCorrectValues.description ?
                                    solution.description + ", " + year + "." :
                                    <select value={selectedDescription} onChange={handleDescriptionSelectChange} name="description" id="description">
                                        <option key="placeholder" value="" disabled>Description</option>
                                        {descriptions.map((description: string) => {
                                            return <option key={description} value={description}>{description}</option>
                                        })}
                                    </select>}
                                {gameStatus === "correct" &&
                                    <p className={style.PlaqueText}><i>Oil on canvas.</i></p>}
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        {showSubmitButton &&
                            <Button className={`${buttonClass} ${style.Button}`} onClick={submitAnswers}>{buttonText}</Button>}
                        {gameStatus === "correct" &&
                            <><Button className={style.Button} onClick={resetGame}>Next Painting</Button>
                                <Button className="btn-secondary" onClick={copyShareLink}>
                                    <BsFillShareFill />{' ' + copyButtonText}
                                </Button></>}
                    </Col>
                </Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <Button className={`btn-secondary btn-sm ${style.Button}`} onClick={() => setShowInfoModal(true)}>Game Info</Button>
                        <Button className={`btn-secondary btn-sm ${style.Button}`} onClick={() => setShowArtistModal(true)}>Need an Art Refresher?</Button>
                    </Col>
                </Row>
            </Container>
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} >
                <Modal.Header closeButton>
                    <Modal.Title>This Art Gallery Does Not Exist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This project uses images generated from <a target="_blank" href="https://github.com/CompVis/stable-diffusion">stable diffusion</a>,
                        a latent diffusion machine learning model which generates images from textual descriptions.
                    </p>
                    <p>
                        All images were generated using a prompt in the format of:
                    </p>
                    <code>
                        {"A painting of <subject> <description> in the style of <artist>"}
                    </code>
                    <p></p>
                    <p>The results are images in the style of famous artists which don't actually exist.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Guesser

export async function getStaticProps() {
    const postsDirectory = path.join(
        process.cwd(),
        'public/projects/painting-guesser'
    );
    const filenames = await fs.readdir(postsDirectory);

    const artists = new Set<string>();
    const subjects = new Set<string>();
    const descriptions = new Set<string>();

    const solutions: any = {

    }

    for (const filename of filenames) {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(
            `${filePath}/prompts.txt`,
            'utf8')

        const artist = fileContents.split("painting by ")[1].split(" of a ")[0].replace("vincent van gogh", "Vincent van Gogh");

        const subject = fileContents.split("of a ")[1].split(" ")[0];

        const description = fileContents.split("of a ")[1].split(" --plms")[0].split(' ').slice(1).join(' ')
        artists.add(artist);
        subjects.add(subject);
        descriptions.add(description);

        solutions[filename] = {
            artist, subject, description
        }
    };

    const artistsList = Array.from(artists);
    const subjectsList = Array.from(subjects);
    const descriptionsList = Array.from(descriptions);

    artistsList.sort();
    subjectsList.sort();
    descriptionsList.sort();

    return {
        props: {
            filenames,
            solutions,
            artists: artistsList,
            subjects: subjectsList,
            descriptions: descriptionsList
        }
    };
}