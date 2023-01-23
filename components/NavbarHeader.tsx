import Link from "next/link";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
// import { Navbar } from "react-bootstrap/navbar";

import style from "./navbar.module.css"

export default function NavbarHeader() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar className={style.Navbar} expand="lg" expanded={expanded}>
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand >
                        <div>
                            <img
                                alt=""
                                src="/logo.png"
                                width="50px"
                                height="50px"
                                className={style.NavbarImage}
                            />
                            <p className={style.NavBarLogoText}>William Edmisten</p>
                        </div>
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <div className="d-flex justify-content-end">
                        <Nav activeKey="/" onSelect={() => setExpanded(false)}>
                            <Link href="/" passHref>
                                <Nav.Link>Home</Nav.Link>
                            </Link>
                            <Link href="/about" passHref>
                                <Nav.Link>About</Nav.Link>
                            </Link>
                            <Link href="/projects" passHref>
                                <Nav.Link>Projects</Nav.Link>
                            </Link>
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>)
}