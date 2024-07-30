import { Container, Row, Col } from "react-bootstrap";
import { BsCalendarFill, BsClockFill } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi"

import style from "./PostMetadata.module.css"

const toPrettyDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    // hack to force UTC timezone
    // https://stackoverflow.com/a/69673926
    return new Date(date + "T12:00:00").toLocaleDateString('US', options)
}

interface PostMetaDataProps {
    date: string,
    readingLength?: string,
    location?: string | JSX.Element
}

export default function PostMetadata({ date, readingLength, location }: PostMetaDataProps
) {
    return (
        <Container fluid className="justify-content-center">
            <Row style={{ marginLeft: "5px" }} >
                {/* Use all columns if readingLength is omited */}
                <Col xs={12} md={(readingLength || location) ? 6 : 12} >
                    <div className="d-flex">
                        <div className="align-self-center">
                            <BsCalendarFill style={{ fontSize: "20px" }} /></div>
                        <div className="align-self-center">
                            <p className={style.Calendar}>{toPrettyDate(date)}</p>
                        </div>
                    </div>
                </Col>
                {readingLength &&
                    <Col xs={12} md={4} >
                        <div className="d-flex">
                            <div className="align-self-center">
                                <BsClockFill style={{ fontSize: "20px" }} />
                            </div>
                            <div className="align-self-center">
                                <p className={style.Clock}>{readingLength}</p>
                            </div>
                        </div>
                    </Col>}
                {location &&
                    <Col xs={12} md={4} >
                        <div className="d-flex">
                            <div className="align-self-center">
                                <HiLocationMarker style={{ fontSize: "20px" }} />
                            </div>
                            <div className="align-self-center">
                                <p className={style.Location}>{location}</p>
                            </div>
                        </div>
                    </Col>}
            </Row>
        </Container>
    )
}
