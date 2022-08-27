import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';

import style from "./paintingguesser.module.css"

interface GuesserProps {
    filenames: string[];
    artists: string[];
    subjects: string[];
    descriptions: string[];
}

export const Guesser = (props: GuesserProps) => {
    const { filenames, artists, subjects, descriptions } = props;


    const [index, setRandomNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * filenames.length));
    }, []);

    const item = index !== undefined ? filenames[index] : "";

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

    const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
    function submitAnswers(event: any) {
        setAnswerSubmitted(true);
    }


    const showSubmitButton: boolean = selectedArtist !== "" && selectedSubject !== "" && selectedDescription !== "";

    return index !== undefined && (
        <>
            <h1 className={style.Headers}>Art Gallery Curator</h1>
            <h2 className={style.Headers}>Oh no! The plaques for these famous paintings got stolen!</h2>
            <h3 className={style.Headers}>Can you fix them?</h3>
            <div className={style.Frame}>
                <img className={style.PaintingImage} src={`/projects/painting-guesser/${item}/00002.jpg`}></img>
            </div>
            <div className={style.Plaque}>
                <p className={style.PlaqueText}>
                    <select value={selectedArtist} onChange={handleArtistSelectChange} name="artist">
                        <option value="" disabled>Artist</option>
                        {artists.map((artist: string) => {
                            return <option value={artist}>{artist}</option>
                        })}
                    </select> </p>
                <p className={style.PlaqueText}>
                    Painting of a {' '}
                    <select value={selectedSubject} onChange={handleSubjectSelectChange} name="subject" id="subject">
                        <option value="" disabled>Subject</option>
                        {subjects.map((subject: string) => {
                            return <option value={subject}>{subject}</option>
                        })}
                    </select>
                    {' '}
                    <select value={selectedDescription} onChange={handleDescriptionSelectChange} name="description" id="description">
                        <option value="" disabled>Description</option>
                        {descriptions.map((description: string) => {
                            return <option value={description}>{description}</option>
                        })}
                    </select>
                </p>
            </div>
            {showSubmitButton &&
                <button onClick={submitAnswers}>Engrave Plaque</button>}
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

    for (const filename of filenames) {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(`${filePath}/prompts.txt`,
            'utf8')

        const artist = fileContents.split("painting by ")[1].split(" of a ")[0];

        const subject = fileContents.split("of a ")[1].split(" ")[0];

        const description = fileContents.split("of a ")[1].split(" --plms")[0].split(' ').slice(1).join(' ')
        artists.add(artist);
        subjects.add(subject);
        descriptions.add(description);
    };

    return {
        props: {
            filenames,
            artists: Array.from(artists),
            subjects: Array.from(subjects),
            descriptions: Array.from(descriptions)
        }
    };
}