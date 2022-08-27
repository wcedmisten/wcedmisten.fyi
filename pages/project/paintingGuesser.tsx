import path from 'path';
import { promises as fs } from 'fs';
import { useEffect, useState } from 'react';


export const Guesser = (props: { filenames: string[] }) => {
    const { filenames } = props;

    const [index, setRandomNumber] = useState<number | undefined>(undefined);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * filenames.length));
    }, []);

    const item = index ? filenames[index] : "";

    return (
        <>
            <h1>Painting Guesser</h1>
            <h2>Can you guess the descriptions of these famous paintings?</h2>
            <img src={`/projects/painting-guesser/${item}/00002.jpg`}></img>
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