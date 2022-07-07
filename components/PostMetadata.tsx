import { Container, Row, Col } from "react-bootstrap";
import { BsCalendarFill, BsClockFill } from "react-icons/bs";

const toPrettyDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    // hack to force UTC timezone
    // https://stackoverflow.com/a/69673926
    return new Date(date + "T12:00:00").toLocaleDateString('US', options)
}

export default function PostMetadata ({ date, readingLength }:
    { date: string, readingLength: string }) {
    return (
        <Container fluid className="justify-content-md-center">
            <Row>
                <Col xs={12} md={4} >
                    <p><BsCalendarFill /> {toPrettyDate(date)}</p>
                </Col>
                <Col xs={12} md={4} >
                    <p><BsClockFill /> {readingLength}</p>
                </Col>
            </Row>
        </Container>
    )
}
