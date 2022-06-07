import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import rehypeHighlight from 'rehype-highlight'
import path from 'path';
import { promises as fs } from 'fs';

import "highlight.js/styles/atom-one-dark.css";

import { useRouter } from 'next/router'

export default function TestPage(props: { sources: any }) {
    const router = useRouter()

    const pid = router.query.pid as string;

    const source = props.sources.find((x: any) => x.filename == pid)

    return (
        <>
            <div className="wrapper">
                <MDXRemote {...source.mdx} />
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

        return {
            filename: path.parse(filename).name,
            mdx: await serialize(fileContents,
                                {
                                    mdxOptions: {
                                        rehypePlugins: [rehypeHighlight],
                                      },
                                }),
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
