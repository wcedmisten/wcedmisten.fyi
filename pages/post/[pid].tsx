import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug';

import { BsCalendarFill, BsClockFill } from 'react-icons/bs'
import readingTime from 'reading-time';

import path from 'path';
import { promises as fs } from 'fs';

import "highlight.js/styles/atom-one-dark.css";

import { useRouter } from 'next/router'
import { Col, Row, Container } from 'react-bootstrap';

const components = {
    img: (props: any) => (
        <img {...props} />
    ),
    Container,
    Col,
    Row,
    p: (props: any) => (
        <p {...props} />
    ),
    ol: (props: any) => (
        <ol {...props} />
    ),
    li: (props: any) => (
        <li {...props} />
    ),
    figure: (props: any) => (
        <figure {...props} />
    ),
};

const toPrettyDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    // hack to force UTC timezone
    // https://stackoverflow.com/a/69673926
    return new Date(date + "T12:00:00").toLocaleDateString('US', options)
}

export default function TestPage(props: { sources: any }) {
    const router = useRouter()

    const pid = router.query.pid as string;

    const source = props.sources.find((x: any) => x.filename == pid)

    const metadata = source.mdx.frontmatter

    return (
        <>
            <div className="wrapper">
                <h1>{metadata.title}</h1>
                <p><BsCalendarFill /> {toPrettyDate(metadata.date)} <BsClockFill /> {source.readingStats.text}</p>
                <MDXRemote {...source.mdx} components={components} />
            </div>
        </>
    )
}

export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), 'mdx')
    const filenames = await fs.readdir(postsDirectory)

    const posts = filenames.map(async (filename) => {
        return path.parse(filename).name
    })

    const x = await Promise.all(posts)

    return {
        paths: x.map(f => ({ params: { pid: f } })),
        fallback: false
    };
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
    const postsDirectory = path.join(process.cwd(), 'mdx')
    const filenames = await fs.readdir(postsDirectory)

    const posts = filenames.map(async (filename) => {
        const filePath = path.join(postsDirectory, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')

        // Generally you would parse/transform the contents
        // For example you can transform markdown to HTML here

        const stats = readingTime(fileContents);

        return {
            filename: path.parse(filename).name,

            mdx: await serialize(fileContents,
                {
                    mdxOptions: {
                        rehypePlugins: [rehypeHighlight, rehypeSlug],
                    },
                    parseFrontmatter: true,
                }),

            readingStats: stats
        }
    })
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            sources: await Promise.all(posts),
        },
    }
}
