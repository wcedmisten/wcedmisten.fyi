import Link from "next/link";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
// import { Navbar } from "react-bootstrap/navbar";

export default function NavbarHeader() {
    const [expanded, setExpanded] = useState(false);


    return (
        <Navbar expand="lg" expanded={expanded} className="py-5">
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand>
                        <img
                            alt=""
                            src="/logo.png"
                            width="50px"
                            height="50px"
                            className="navbar-image"
                        />
                        {' '}
                        William Edmisten
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle
                    onClick={() => setExpanded(true)}
                    aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav activeKey="/" onSelect={() => setExpanded(false)}>
                        <Link href="/" passHref>
                            <Nav.Link>Home</Nav.Link>
                        </Link>
                        <Link href="/about" passHref>
                            <Nav.Link>About</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>)
}