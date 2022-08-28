import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';

import style from "./paintingguesser.module.css"
import { Button, Col, Container, Row } from 'react-bootstrap';

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

    const [shuffled, setShuffled] = useState<number[] | undefined>(undefined);

    useEffect(() => {
        setShuffled(shuffleArray(filenames));
    }, []);

    const [index, setIndex] = useState<number>(0);

    const pictureId: string = shuffled !== undefined ? shuffled[index] : "";

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
        if (answersCorrect) {
            setGameStatus("correct");
        } else {
            setGameStatus("wrong");
        }
    }

    function resetGame(event: any) {
        setIndex(index + 1);
        setGameStatus("guessing");
    }

    const solution = solutions[pictureId];
    const answersCorrect: boolean = selectedArtist === solution?.artist &&
        selectedSubject === solution?.subject &&
        selectedDescription === solution?.description;

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
        'Claude Monet': [1865, 1926]
    };

    const pictureInt: number = parseInt(pictureId?.slice(-8), 16);
    const yearRange: number[] = yearRanges[solution?.artist]
    const year: any = yearRange !== undefined ? yearRange[0] + pictureInt % (yearRange[1] - yearRange[0]) : undefined
    console.log(year);

    return shuffled !== undefined && (
        <>
            <Container className="justify-content-md-center">
                <Row><Col className="justify-content-center text-center">
                    <h1 className={style.Headers}>Art Gallery Curator</h1>
                    <h3 className={style.Headers}>Oh no! The plaques for these famous paintings got stolen!</h3>
                    <h3 className={style.Headers}>Can you fix them?</h3>
                </Col></Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <div className={style.Frame}>
                            <img className={style.PaintingImage} src={`/projects/painting-guesser/${pictureId}/00002.jpg`}></img>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="justify-content-center text-center">
                        <div className={style.Plaque}>
                            <p className={style.PlaqueText}>
                                {gameStatus === "correct" ?
                                    <h3 className={style.PlaqueText}>{solution.artist}</h3> :
                                    <select value={selectedArtist} onChange={handleArtistSelectChange} name="artist">
                                        <option key="placeholder" value="" disabled>Artist</option>
                                        {artists.map((artist: string) => {
                                            return <option key={artist} value={artist}>{artist}</option>
                                        })}
                                    </select>
                                }
                            </p>
                            <p className={style.PlaqueText}>
                                Painting of a {' '}
                                {gameStatus === "correct" ?
                                    solution.subject :
                                    <select value={selectedSubject} onChange={handleSubjectSelectChange} name="subject" id="subject">
                                        <option key="placeholder" value="" disabled>Subject</option>
                                        {subjects.map((subject: string) => {
                                            return <option key={subject} value={subject}>{subject}</option>
                                        })}
                                    </select>
                                }
                                {' '}
                                {gameStatus === "correct" ?
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
                            <Button className={style.Button} onClick={resetGame}>Next Painting</Button>}
                    </Col>
                </Row>
            </Container>
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

    return {
        props: {
            filenames,
            solutions,
            artists: Array.from(artists),
            subjects: Array.from(subjects),
            descriptions: Array.from(descriptions)
        }
    };
}