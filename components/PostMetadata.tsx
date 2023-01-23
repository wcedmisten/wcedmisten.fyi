import { Container, Row, Col } from "react-bootstrap";
import { BsCalendarFill, BsClockFill } from "react-icons/bs";

const toPrettyDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    // hack to force UTC timezone
    // https://stackoverflow.com/a/69673926
    return new Date(date + "T12:00:00").toLocaleDateString('US', options)
}

export default function PostMetadata({ date, readingLength }:
    { date: string, readingLength?: string }) {
    return (
        <Container fluid className="justify-content-center">
            <Row style={{ marginLeft: "5px" }} >
                {/* Use all columns if readingLength is omited */}
                <Col xs={12} md={readingLength ? 6 : 12} >
                    <div className="d-flex">
                        <div className="align-self-center">
                            <BsCalendarFill style={{ fontSize: "20px" }}/></div>
                        <div className="align-self-center">
                            <p style={{ margin: "2px 0 0 5px" }}>{toPrettyDate(date)}</p>
                        </div>
                    </div>
                </Col>
                {readingLength &&
                    <Col xs={12} md={4} >
                        <div className="d-flex">
                            <div className="align-self-center">
                                <BsClockFill style={{ fontSize: "20px" }}/>
                            </div>
                            <div className="align-self-center">
                                <p style={{ margin: "2px 0 0 5px" }}>{readingLength}</p>
                            </div>
                        </div>
                    </Col>}
            </Row>
        </Container>
    )
}
