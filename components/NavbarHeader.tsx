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
                                src="/owl-banner.svg"
                                width="210px"
                                height="80px"
                            />
                        </div>
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <div className="d-flex justify-content-end">
                        <Nav onSelect={() => setExpanded(false)}>
                            <Link href="/" passHref>
                                <Nav.Link className={style.NavLink}>Posts</Nav.Link>
                            </Link>
                            <Link href="/about" passHref>
                                <Nav.Link className={style.NavLink}>About</Nav.Link>
                            </Link>
                            <Link href="/projects" passHref>
                                <Nav.Link className={style.NavLink}>Projects</Nav.Link>
                            </Link>
                            <Link href="/talks" passHref>
                                <Nav.Link className={style.NavLink}>Talks</Nav.Link>
                            </Link>
                            <Link href="/william-edmisten-resume-2024.pdf" passHref>
                                <Nav.Link className={style.NavLink}>Résumé</Nav.Link>
                            </Link>
                            <Link href="https://square.link/u/nVH6Yoq7" passHref>
                                <Nav.Link className={style.BuyMeACoffeeLink}>Buy Me a Coffee</Nav.Link>
                            </Link>
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>)
}