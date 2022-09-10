import { useEffect, useRef, useState } from "react";
import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';

// assign random points in the image
function getRandomPoints(width: number, height: number) {
    const p = new PoissonDiskSampling({
        shape: [width, height],
        minDistance: 20,
        maxDistance: 30,
        tries: 10
    });
    const points = p.fill();

    return points;
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
function line(x0: any, y0: any, x1: any, y1: any, img: any, ctx: any) {
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
        // store pixel color at x0, y0 
        //this.plot(x0, y0, color, img);
        const pixel = ctx.getImageData(x0, y0, 1, 1);
        const data = pixel.data;
        pixels.push(data);

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

function fillTriangle(triangles: any, img: any, ctx: any) {
    const vertices: any = Array.from(triangles);
    vertices.sort((a: any, b: any) => a.y - b.y);

    if (vertices[1].y == vertices[2].y) {
        return fillBottomFlatTriangle(vertices[0], vertices[1], vertices[2], img, ctx);
    } else if (vertices[0].y == vertices[1].y) {
        return fillTopFlatTriangle(vertices[0], vertices[1], vertices[2], img, ctx);
    } else {
        let v4 = {
            x: vertices[0].x + (vertices[1].y - vertices[0].y) / (vertices[2].y - vertices[0].y) * (vertices[2].x - vertices[0].x),
            y: vertices[1].y
        };

        let pixels: any[] = [];

        return pixels.concat(
            fillBottomFlatTriangle(vertices[0], vertices[1], v4, img, ctx),
            fillTopFlatTriangle(vertices[1], v4, vertices[2], img, ctx)
        );
    }
}

function fillBottomFlatTriangle(v1: any, v2: any, v3: any, img: any, ctx: any): any[] {
    let invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
    let invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

    let curx1 = v1.x;
    let curx2 = v1.x;

    let pixels: any[] = []

    for (let scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
        pixels = pixels.concat(
            line(curx1, scanlineY, curx2, scanlineY, img, ctx)
        );
        curx1 += invslope1;
        curx2 += invslope2;
    }

    return pixels;
}

function fillTopFlatTriangle(v1: any, v2: any, v3: any, img: any, ctx: any) {
    let invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
    let invslope2 = (v3.x - v2.x) / (v3.y - v2.y);

    let curx1 = v3.x;
    let curx2 = v3.x;

    let pixels: any[] = []

    for (let scanlineY = v3.y; scanlineY > v1.y; scanlineY--) {
        pixels = pixels.concat(
            line(curx1, scanlineY, curx2, scanlineY, img, ctx)
        );
        curx1 -= invslope1;
        curx2 -= invslope2;
    }

    return pixels;
}

function Triangles() {
    const [selectedFile, setSelectedFile] = useState(null);

    const canvasRef = useRef(null);

    const draw = async (ctx: any) => {
        if (selectedFile !== null) {
            const testBitmap = await createImageBitmap(
                selectedFile,
            );

            console.log(testBitmap);

            const maxWidth = 750;
            const maxHeight = 750;
            const resizeOptions = testBitmap.width > maxWidth ? { resizeWidth: maxWidth } : { resizeHeight: maxHeight }

            const bitmap = await createImageBitmap(
                selectedFile,
                resizeOptions
            );

            if (canvasRef?.current !== null) {
                canvasRef.current.width = bitmap.width;
                canvasRef.current.height = bitmap.height;
            }
            const points = getRandomPoints(bitmap.width, bitmap.height);
            const delaunator = Delaunator.from(points);

            ctx.drawImage(bitmap, 0, 0);

            const triangles: any[] = [];

            forEachTriangle(points, delaunator,
                (e: any, triangle: any, q: any) => {

                    const xyTriangle = triangle.map((t: any[]) => {
                        return {
                            x: t[0],
                            y: t[1]
                        }
                    });

                    const pixels = fillTriangle(xyTriangle, bitmap, ctx);

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
    }

    useEffect(() => {
        const canvas: any = canvasRef.current
        const context = canvas.getContext('2d')

        //Our draw come here
        draw(context)
    }, [draw])



    return (
        <>
            <input type="file" onChange={(e: any) => setSelectedFile(e.target.files[0])} />
            <canvas ref={canvasRef}></canvas>
        </>
    );
}

export default Triangles;