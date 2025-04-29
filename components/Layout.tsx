
import Head from 'next/head';
import React from 'react'
import Footer from './Footer';
import NavbarHeader from './NavbarHeader'

interface OpenGraph {
    title: string;
    image: string;
    type: string;
    url: string;
    description: string;
}

interface LayoutProps {
    children: React.ReactNode;
    opengraph: OpenGraph | undefined;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    opengraph,
}) => (
    <>
        <Head>
            <title>{opengraph?.title || "William Edmisten"}</title>
            <meta name="description" content={opengraph?.description || "William Edmisten's personal developer blog."} />
            {opengraph && <>
                <meta property="og:title" content={opengraph.title} />
                <meta property="og:type" content={opengraph.type} />
                <meta property="og:image" content={opengraph.image} />
                <meta property="og:url" content={opengraph.url} />
                {opengraph?.description && <meta property="og:description" content={opengraph.description} />}
            </>}
            <link rel="icon" href="/favicon.ico" />
            <link rel="me" href="https://mastodon.social/@wcedmisten"></link>
            <link
                rel="alternate"
                type="application/rss+xml"
                title="RSS Feed for wcedmisten.fyi"
                href="/feed.xml"
            />
            <script defer data-domain="wcedmisten.fyi" src="http://zlfieuwrjks.wcedmisten.dev/js/script.js"></script>
        </Head>
        <NavbarHeader />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;