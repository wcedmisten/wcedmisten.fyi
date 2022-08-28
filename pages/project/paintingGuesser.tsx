import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';

import style from "./paintingguesser.module.css"
import { Button } from 'react-bootstrap';

interface GuesserProps {
    solutions: any,
    filenames: string[];
    artists: string[];
    subjects: string[];
    descriptions: string[];
}

type GameStatus = "guessing" | "correct" | "wrong";

export const Guesser = (props: GuesserProps) => {
    const { filenames, artists, subjects, descriptions, solutions } = props;

    const [index, setRandomNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * filenames.length));
    }, []);

    const pictureId = index !== undefined ? filenames[index] : "";

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
        "wrong": "Wrong!",
    }[gameStatus]

    return index !== undefined && (
        <>
            <h1 className={style.Headers}>Art Gallery Curator</h1>
            <h2 className={style.Headers}>Oh no! The plaques for these famous paintings got stolen!</h2>
            <h3 className={style.Headers}>Can you fix them?</h3>
            <div className={style.Frame}>
                <img className={style.PaintingImage} src={`/projects/painting-guesser/${pictureId}/00002.jpg`}></img>
            </div>
            <div className={style.Plaque}>
                <p className={style.PlaqueText}>
                    {gameStatus === "correct" ?
                        <p className={style.PlaqueText}>{solution.artist}</p> :
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
                        solution.description :
                        <select value={selectedDescription} onChange={handleDescriptionSelectChange} name="description" id="description">
                            <option key="placeholder" value="" disabled>Description</option>
                            {descriptions.map((description: string) => {
                                return <option key={description} value={description}>{description}</option>
                            })}
                        </select>}
                </p>
            </div>
            {showSubmitButton &&
                <Button className={buttonClass} onClick={submitAnswers}>{buttonText}</Button>}
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

        const artist = fileContents.split("painting by ")[1].split(" of a ")[0];

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