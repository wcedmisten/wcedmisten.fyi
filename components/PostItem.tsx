import Link from "next/link";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";

import PostMetadata from "./PostMetadata";

import style from "./postitem.module.css"

export default function PostItem({ href, thumbnailURL, title, description, date, thumbnailAlt, readingLength }:
    { href: string, thumbnailURL: string, title: string, description: string, date: string, thumbnailAlt: string, readingLength?: string }) {
    return (
        <ListGroup.Item className={style.PostThumbnail}>
            <Container fluid className="justify-content-md-center" style={{padding: "2 0 2 0"}}>
                <Row>
                    <Col xs={12} md={4} >
                        <Container fluid className="justify-content-md-center" style={{padding: "2 0 2 0"}}>
                            <Row>
                                <Link href={href}>
                                    <a>
                                        <Image
                                            src={thumbnailURL}
                                            fluid
                                            width={"100%"}
                                            rounded
                                            alt={thumbnailAlt}
                                            className="post-thumbnail border" />
                                    </a>
                                </Link>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <Container fluid className="justify-content-md-center">
                            <Row>
                                <Link href={href}>
                                    <a style={{fontSize: "22px"}} >{title}</a>
                                </Link>
                            </Row>
                            <Row>
                                <PostMetadata date={date} readingLength={readingLength} />
                            </Row>
                            <Row>
                                <p className={style.PostDescription}>
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
