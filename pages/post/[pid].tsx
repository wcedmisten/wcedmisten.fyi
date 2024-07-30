import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm'

import readingTime from 'reading-time';

import path from 'path';
import { promises as fs } from 'fs';

import "highlight.js/styles/atom-one-dark.css";

import { Col, Row, Container } from 'react-bootstrap';
import PostMetadata from '../../components/PostMetadata';

import style from './post.module.css'
import './post.module.css'
import { useEffect, useRef, useState } from 'react';

const components = {
    img: (props: any) => (
        <img className={style.PostImage} {...props} />
    ),
    Container,
    Col,
    Row,
    figure: (props: any) => (
        <figure className={style.PostFigure} {...props} />
    ),
    li: (props: any) => (
        <li className={style.List} {...props} />
    ),
    ul: (props: any) => (
        <ul className={style.UnorderedList} {...props} />
    ),
    h1: (props: any) => (
        <h1 className={style.PostH1} {...props} />
    ),
    h2: (props: any) => (
        <h2 className={style.PostH2} {...props} >
            <a className={style.HeaderLink} href={"#" + props.id}>
                {props.children}
            </a>
        </h2>
    ),
    h3: (props: any) => (
        <h3 className={style.PostH3} {...props} >
            <a className={style.HeaderLink} href={"#" + props.id}>
                {props.children}
            </a>
        </h3>
    ),
    h4: (props: any) => (
        <h4 className={style.PostH4} {...props} >
            <a className={style.HeaderLink} href={"#" + props.id}>
                {props.children}
            </a>
        </h4>
    ),
};

export default function Post(props: { source: any }) {
    const source = props.source;
    const metadata = source.mdx.frontmatter;

    const [windowHeight, setWindowHeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const pageRef = useRef(null);

    const progressRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        setHeight((pageRef?.current as any)?.clientHeight);
    })

    useEffect(() => {
        setWidth(window?.innerWidth);
    })

    useEffect(() => {
        setWindowHeight(window?.innerHeight);
    })

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    const barWidth = scrollPosition === 0 ? 0 : ((scrollPosition + windowHeight) / height) * width;

    return (
        <>
            <div className={style.ProgressContainer}>
                <span className={style.ProgressBar} ref={progressRef} style={{ width: barWidth }}></span>
            </div>
            <div className="post-wrapper" ref={pageRef} onScroll={handleScroll}>
                <h1>{metadata.title}</h1>
                <PostMetadata date={metadata.date} readingLength={source.readingStats.text} />
                <MDXRemote {...source.mdx} components={components} />
            </div>
        </>
    )
}

const ARTICLES_DIR = 'articles'

export async function getStaticPaths() {
    const postsDirectory = path.join(process.cwd(), ARTICLES_DIR)
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
export async function getStaticProps({ params }: { params: any }) {
    const { pid } = params;

    const postsDirectory = path.join(process.cwd(), ARTICLES_DIR)
    const filenames = await fs.readdir(postsDirectory)

    const post: any = filenames.find((x: any) => x === `${pid}.mdx`);

    const filePath = path.join(postsDirectory, post)
    const fileContents = await fs.readFile(filePath, 'utf8')

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here

    const stats = readingTime(fileContents);

    const source = {
        filename: path.parse(post).name,

        mdx: await serialize(fileContents,
            {
                mdxOptions: {
                    rehypePlugins: [rehypeHighlight, rehypeSlug],
                    remarkPlugins: [remarkGfm]
                },
                parseFrontmatter: true,
            }),

        readingStats: stats
    }

    const meta: any = source.mdx.frontmatter;

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            source,
            opengraph: {
                title: meta.title,
                image: `https://wcedmisten.fyi${meta.thumbnail}`,
                type: "article",
                url: `https://wcedmisten.fyi/post/${source.filename}/`,
                description: meta.description
            }
        },
    }
}
