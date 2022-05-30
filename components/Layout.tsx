
import React from 'react'
import Navbar from './Navbar'
// import Footer from './footer'

type LayoutProps = {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
}) => (
    <>
        <Navbar />
        <main>{children}</main>
        {/* <Footer /> */}
    </>
);

export default Layout;