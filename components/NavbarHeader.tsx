import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
// import { Navbar } from "react-bootstrap/navbar";

export default function NavbarHeader() {
    return (
        <Navbar expand="lg" className="py-5">
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
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav activeKey="/">
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