
import React from 'react'
import NavbarHeader from './NavbarHeader'
// import Footer from './footer'

type LayoutProps = {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
}) => (
    <>
        <NavbarHeader />
        <main>{children}</main>
        {/* <Footer /> */}
    </>
);

export default Layout;