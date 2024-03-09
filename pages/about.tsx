import { Container, Row, Col, Image } from "react-bootstrap";

function AboutPage() {
    return (<div className="post-wrapper">
        <Container >
            <Row><Col><h1>About</h1></Col></Row>
            <Row>
                <Col xs={{ span: 12 }} md={{ span: 6 }}>
                    <p>Hello! I'm William Edmisten, a full stack software engineer working
                        for OneStudyTeam (but all opinions are my own).
                    </p>

                    <p>
                        I have a Bachelor of Science
                        in Computer Science from Virginia Tech.
                    </p>

                    <p>I frequently start hobby projects, and I'm hoping this blog
                        will give me more accountability to complete them. I also
                        hope to document my progress in a way that might be helpful
                        for others.
                    </p>

                    <p>
                        I often write about Python, OpenStreetMap, web scraping, and data visualization.
                    </p>

                    <p>
                        You can contact me at <a href="mailto:wcedmisten@gmail.com?subject=Feedback on wcedmisten.fyi">
                            wcedmisten@gmail.com
                        </a> with
                        questions, comments, or criticism! Or just to say hi!
                    </p>
                </Col>
                <Col xs={{ span: 12 }} md={{ span: 6 }}>
                    <Image
                        src="/william.jpg"
                        rounded={true}
                        fluid={true}
                        alt="William in front of a sunset" />
                </Col>
            </Row>
        </Container>
    </div>)
}

export default AboutPage
