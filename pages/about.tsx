import { Container, Row, Col, Image } from "react-bootstrap";

function AboutPage() {
    return (<>
        <Container>
            <Row><Col><h1>About</h1></Col></Row>
            <Row>
                <Col xs={{ span: 12 }} md={{ span: 6 }}>
                    <p>I'm William Edmisten, a software engineer working
                        for Reify Health. I graduated from Virginia Tech in 2019
                        with a BS in Computer Science.</p>

                    <p>I like starting hobby projects, and I'm hoping this blog
                        will give me more accountability to complete them. I also
                        hope to document my progress in a way that might be helpful
                        for others.</p>

                    <p>
                        My hobbies include programming, gardening, cooking, and hiking.
                    </p>
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 6 }}>
                    <Image
                        src="/william.jpg"
                        rounded={true}
                        fluid={true}
                        alt="William pointing at a lime tree at Lewis Ginter Botanical Gardens" />
                </Col>
            </Row>
        </Container>
    </>)
}

export default AboutPage
