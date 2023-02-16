import { useCallback, useEffect, useRef, useState } from "react";
import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';

import style from "./lowpoly.module.css"

import { Button, Container, Form, Row } from "react-bootstrap";

// assign random points in the image
function getRandomPoints(width: number, height: number, minDistance: number, maxDistance: number) {
    const p = new PoissonDiskSampling({
        shape: [width + 2 * minDistance, height + 2 * minDistance],
        minDistance,
        maxDistance,
        tries: 10
    });
    const points = p.fill();

    return points.map((p: number[]) => {
        let newX = p[0] - minDistance;
        if (newX - minDistance < 0) {
            newX = 0
        } else if (newX + minDistance >= width) {
            newX = width;
        }

        let newY = p[1] - minDistance;
        if (newY - minDistance < 0) {
            newY = 0
        } else if (newY + minDistance >= height) {
            newY = height;
        }

        return [newX, newY];
    });
};


// get triangles from delaunator

function edgesOfTriangle(t: any) { return [3 * t, 3 * t + 1, 3 * t + 2]; }

function pointsOfTriangle(delaunay: any, t: any) {
    return edgesOfTriangle(t)
        .map(e => delaunay.triangles[e]);
}

function forEachTriangle(points: any, delaunay: any, callback: any) {
    for (let t = 0; t < delaunay.triangles.length / 3; t++) {
        callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
    }
}


// triangle rasterization
// http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html
function line(x0: any, y0: any, x1: any, y1: any, imgData: any) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1;
    var sy = y0 < y1 ? 1 : -1;
    var err = dx - dy;

    const pixels = [];

    let itt = 0;
    while (true) {
        // first pixel is at imgData[0-3]
        // second pixel at imgData[4-7]
        const { data, width } = imgData;
        const pixelIdx = (y0 * width + x0) * 4;
        const R = data[pixelIdx] || 0;
        const G = data[pixelIdx + 1] || 0;
        const B = data[pixelIdx + 2] || 0;
        const A = data[pixelIdx + 3] || 0;

        const pixel = [R, G, B, A];

        pixels.push(pixel);

        itt++;
        if (x0 == x1 && y0 == y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }

    return pixels;
}

function fillTriangle(triangles: any, imgData: any) {
    const vertices: any = Array.from(triangles);
    vertices.sort((a: any, b: any) => a.y - b.y);

    if (vertices[1].y == vertices[2].y) {
        return fillBottomFlatTriangle(vertices[0], vertices[1], vertices[2], imgData);
    } else if (vertices[0].y == vertices[1].y) {
        return fillTopFlatTriangle(vertices[0], vertices[1], vertices[2], imgData);
    } else {
        let v4 = {
            x: vertices[0].x + (vertices[1].y - vertices[0].y) / (vertices[2].y - vertices[0].y) * (vertices[2].x - vertices[0].x),
            y: vertices[1].y
        };

        let pixels: any[] = [];

        return pixels.concat(
            fillBottomFlatTriangle(vertices[0], vertices[1], v4, imgData),
            fillTopFlatTriangle(vertices[1], v4, vertices[2], imgData)
        );
    }
}

function fillBottomFlatTriangle(v1: any, v2: any, v3: any, imgData: any): any[] {
    let invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
    let invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

    let curx1 = v1.x;
    let curx2 = v1.x;

    let pixels: any[] = []

    for (let scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
        pixels = pixels.concat(
            line(curx1, scanlineY, curx2, scanlineY, imgData)
        );
        curx1 += invslope1;
        curx2 += invslope2;
    }

    return pixels;
}

function fillTopFlatTriangle(v1: any, v2: any, v3: any, imgData: any) {
    let invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
    let invslope2 = (v3.x - v2.x) / (v3.y - v2.y);

    let curx1 = v3.x;
    let curx2 = v3.x;

    let pixels: any[] = []

    for (let scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {
        pixels = pixels.concat(
            line(curx1, scanlineY, curx2, scanlineY, imgData)
        );
        curx1 -= invslope1;
        curx2 -= invslope2;
    }

    return pixels;
}

function Triangles() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const downloadFilename = selectedFile ? `low-poly-${selectedFile.name}`.replace(/\.[^.]+$/, '.png') : "test.png"

    const [minDistance, setMinDistance] = useState<number>(20);
    const maxDistance = minDistance + 10;

    const canvasRef = useRef<any>(null);
    const canvas = canvasRef.current;

    const [downloadFile, setDownloadFile] = useState<any>("");

    const draw = async (ctx: any) => {
        if (selectedFile !== null) {
            const testBitmap = await createImageBitmap(
                selectedFile,
            );

            const maxWidth = 750;
            const maxHeight = 750;
            let resizeOptions: { resizeWidth?: number; resizeHeight?: number; } = {
                resizeWidth: undefined,
                resizeHeight: undefined
            }

            if (testBitmap.width >= testBitmap.height &&
                testBitmap.width > maxWidth) {
                resizeOptions.resizeWidth = maxWidth;
            } else if (testBitmap.width < testBitmap.height &&
                testBitmap.height > maxHeight) {
                resizeOptions.resizeHeight = maxHeight;
            }

            const bitmap = await createImageBitmap(
                selectedFile,
                resizeOptions
            );

            if (canvas) {
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
            }

            const points = getRandomPoints(bitmap.width, bitmap.height, minDistance, maxDistance);
            const delaunator = Delaunator.from(points);

            ctx.drawImage(bitmap, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            forEachTriangle(points, delaunator,
                (e: any, triangle: any, q: any) => {

                    const xyTriangle = triangle.map((t: any[]) => {
                        return {
                            x: t[0],
                            y: t[1]
                        }
                    });

                    const pixels = fillTriangle(xyTriangle, imgData);

                    const totals = [0, 0, 0];
                    pixels.forEach((pixel) => {
                        totals[0] += pixel[0];
                        totals[1] += pixel[1];
                        totals[2] += pixel[2];
                    })

                    const red = totals[0] / pixels.length;
                    const green = totals[1] / pixels.length;
                    const blue = totals[2] / pixels.length;

                    ctx.beginPath();
                    ctx.moveTo(triangle[0][0], triangle[0][1]);
                    ctx.lineTo(triangle[1][0], triangle[1][1]);
                    ctx.lineTo(triangle[2][0], triangle[2][1]);
                    // ctx.stroke();

                    ctx.fillStyle = `rgba(${red}, ${green}, ${blue})`;
                    ctx.fill();
                }
            );
        }
    };

    const redraw = async () => {
        const context = canvas?.getContext('2d');
        await draw(context);
        setDownloadFile(canvas?.toDataURL("image/png").replace("image/png", "image/octet-stream") || "");
    };

    useEffect(() => {
        redraw(); // This is be executed when `loading` state changes
    }, [selectedFile])

    return (
        <>
            <Container>
                <Row className="justify-content-center text-center">
                    <h1>Low Polygon Image Filter</h1>
                </Row>
                <Row className="justify-content-center">
                    <Form className="w-75 text-center">
                        <Form.Group>
                            <Form.Label>Select a picture</Form.Label>
                            <Form.Control type="file" onChange={async (e: any) => setSelectedFile(e.target.files[0])} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Triangle Size</Form.Label>
                            <Form.Range value={minDistance} min={10} max={100} onChange={(e: any) => setMinDistance(parseInt(e.target.value))} />
                        </Form.Group>
                        {selectedFile && <>
                            <Button className={`btn-primary ${style.Button}`} onClick={redraw}>Redraw</Button>
                            <a
                                className="btn btn-primary"
                                role="button"
                                download={downloadFilename}
                                href={downloadFile}>
                                Download
                            </a>
                        </>}
                    </Form>
                </Row>
                <Row>
                    <canvas className={style.Canvas} ref={canvasRef}></canvas>
                </Row>
            </Container>
        </>
    );
}

export default Triangles;

export async function getStaticProps() {
    return {
        props: { 
            opengraph: {
                title: "Low Polygon Image Filter",
                image: "https://wcedmisten.fyi/og-images/low-poly.jpg",
                type: "website",
                url: "https://wcedmisten.fyi/project/lowPoly/"
            }
        }
    }
}