
import Head from 'next/head';
import React from 'react'
import Footer from './Footer';
import NavbarHeader from './NavbarHeader'

type LayoutProps = {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
}) => (
    <>
        <Head>
            <title>wcedmisten.fyi</title>
            <meta name="description" content="William Edmisten's Developer Blog" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavbarHeader />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;