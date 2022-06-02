import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
// import { Navbar } from "react-bootstrap/navbar";

export default function NavbarHeader() {
    return (
        <Navbar expand="lg" className="py-5">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src="/logo.png"
                        width="30"
                        height="30"
                    // className="d-inline-block align-top"
                    />
                    {' '}
                    William Edmisten
                </Navbar.Brand>
                <Nav activeKey="/">
                    <Link href="/" passHref>
                        <Nav.Link>Home</Nav.Link>
                    </Link>
                    <Link href="/about" passHref>
                        <Nav.Link>About</Nav.Link>
                    </Link>
                </Nav>
            </Container>
        </Navbar>)
}