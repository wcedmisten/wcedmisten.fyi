
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
        <NavbarHeader />
        <main>{children}</main>
        <Footer />
    </>
);

export default Layout;