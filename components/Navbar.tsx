import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function Navbar() {
    return (
        <Nav activeKey="/">
            <Link href="/" passHref>
                <Nav.Link>Home</Nav.Link>
            </Link>
            <Link href="/about" passHref>
                <Nav.Link>About Me</Nav.Link>
            </Link>
        </Nav>)
}