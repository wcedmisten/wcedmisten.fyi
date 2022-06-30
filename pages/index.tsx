import type { NextPage } from 'next'
import path from 'path'

import { serialize } from 'next-mdx-remote/serialize'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug';

import { promises as fs } from 'fs';

import { ListGroup } from 'react-bootstrap'
import PostItem from '../components/PostItem'

interface HomeType {
  sources: any;
}

const getPosts: any = (sources: any) => {
  return sources.map((source: any) => ({
    filename: source.filename,
    meta: source.mdx.frontmatter
  })).sort((a: any, b: any) => { // sort by date (assuming ISO 8601 format)
    return b.meta.date.localeCompare(a.meta.date)
  });
};

const toPrettyDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  // hack to force UTC timezone
  // https://stackoverflow.com/a/69673926
  return new Date(date + "T12:00:00").toLocaleDateString('US', options)
}

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
      date={toPrettyDate(post.meta.date)} />)

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

    return {
      filename: path.parse(filename).name,

      mdx: await serialize(fileContents,
        {
          mdxOptions: {
            rehypePlugins: [rehypeHighlight, rehypeSlug],
          },
          parseFrontmatter: true,
        }),
    }
  })
  // By returning {props: {posts} }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      sources: await Promise.all(posts),
    },
  }
}