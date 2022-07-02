import { Col, Container, Row } from "react-bootstrap";
import { BsGithub, BsRss } from "react-icons/bs";

export default function Footer() {
    return (
        <div className="footer">
            <Container>
                <Row>
                    <Col>
                        <a className="footer-icon-link"
                            aria-label="RSS Feed"
                            href="/feed.xml">
                            <BsRss />
                        </a>
                        {' '}
                        <a className="footer-icon-link"
                            aria-label="Github Source"
                            href="https://github.com/wcedmisten/wcedmisten.fyi">
                            <BsGithub />
                        </a>
                    </Col>
                    <Col xs={10}>
                        <p>Licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}