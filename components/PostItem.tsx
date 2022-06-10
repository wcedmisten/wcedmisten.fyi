import Link from "next/link";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";

import { BsCalendar4 } from "react-icons/bs"


export default function PostItem({ href, thumbnailURL, title, description, date, thumbnailAlt }:
    { href: string, thumbnailURL: string, title: string, description: string, date: string, thumbnailAlt: string }) {
    return (
        <ListGroup.Item>
            <Container fluid className="justify-content-md-center">
                <Row>
                    <Col xs={12} md={4} >
                        <Container fluid className="justify-content-md-center">
                            <Row>
                                <Image
                                    src={thumbnailURL}
                                    fluid
                                    rounded
                                    alt={thumbnailAlt}
                                    className="post-thumbnail"></Image>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <Container fluid className="justify-content-md-center">
                            <Row>
                                <Link href={href}>
                                    {title}
                                </Link>
                            </Row>
                            <Row>
                                <p>
                                    <BsCalendar4 /> {date}
                                </p>
                            </Row>
                            <Row>
                                <p>
                                    {description}
                                </p>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    )
}
