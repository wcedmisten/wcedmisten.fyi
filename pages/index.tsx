import type { NextPage } from 'next'
import path from 'path'

import { serialize } from 'next-mdx-remote/serialize'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug';

import { promises as fs } from 'fs';

import { ListGroup } from 'react-bootstrap'
import PostItem from '../components/PostItem'

import generateRSS from "../utils/RSS"
import readingTime from 'reading-time';

interface HomeType {
  sources: any;
}

const getPosts: any = (sources: any) => {
  return sources.map((source: any) => ({
    filename: source.filename,
    readingLength: source.readingStats.text,
    meta: source.mdx.frontmatter
  })).sort((a: any, b: any) => { // sort by date (assuming ISO 8601 format)
    return b.meta.date.localeCompare(a.meta.date)
  });
};

const Home: NextPage<HomeType> = (props) => {
  const postData = getPosts(props.sources)

  const posts = postData.map((post: any) =>
    <PostItem
      key={post.filename}
      href={`/post/${post.filename}`}
      thumbnailURL={post.meta.thumbnail}
      thumbnailAlt={post.meta.thumbnailAlt}
      title={post.meta.title}
      description={post.meta.description}
      date={post.meta.date}
      readingLength={post.readingLength} />)

  return (
    <div>
      <main>
        <h1>Posts</h1>
        <ListGroup variant="flush">
          {posts}
        </ListGroup>
      </main>
    </div >
  )
}

export default Home

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'mdx')
  const filenames = await fs.readdir(postsDirectory)

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')

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
  });
  const sources = await Promise.all(posts);
  const postList = getPosts(sources);

  generateRSS(postList);

  // By returning {props: {posts} }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      sources
    },
  }
}