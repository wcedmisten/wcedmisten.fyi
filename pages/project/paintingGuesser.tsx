import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';

import style from "./paintingguesser.module.css"

export const Guesser = (props: { filenames: string[] }) => {
    const { filenames } = props;

    const [index, setRandomNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * filenames.length));
    }, []);

    const item = index ? filenames[index] : "";

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
                        <option value="Salvador Dali">Salvador Dali</option>
                    </select> </p>
                <p className={style.PlaqueText}>
                    Painting of a {' '}
                    <select value={selectedSubject} onChange={handleSubjectSelectChange} name="subject" id="subject">
                        <option value="" disabled>Subject</option>
                        <option value="Dolphin">Dolphin</option>
                    </select>
                    {' '}
                    <select value={selectedDescription} onChange={handleDescriptionSelectChange} name="description" id="description">
                        <option value="" disabled>Description</option>
                        <option value="saab">Wearing a Tophat</option>
                    </select>
                </p>
            </div>
        </>
    )
}

export default Guesser

export async function getStaticProps() {
    const postsDirectory = path.join(
        process.cwd(),
        'public/projects/painting-guesser'
    );
    const filenames = await fs.readdir(postsDirectory)

    filenames.forEach(async filename => {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(`${filePath}/prompts.txt`,
            'utf8')
        // console.log(fileContents);
    })

    return { props: { filenames } }
}