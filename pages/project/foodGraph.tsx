import * as d3 from "d3";
import React, { useEffect, useState } from "react";

import { Col, Row, Container } from 'react-bootstrap';

// graph dynamic constants
const REPEL_STRENGTH = -500
const ATTRACT_POINT_X = 150
const ATTRACT_POINT_Y = 150


function runForceGraph(
    container: any,
    linksData: any[],
    nodesData: any[]
) {
    const links = linksData.map((d: any) => Object.assign({}, d));
    const nodes = nodesData.map((d: any) => Object.assign({}, d));


    const containerRect = container.getBoundingClientRect();

    const height = containerRect.height;
    const width = containerRect.width;

    const xOffset = containerRect.x;
    const yOffset = containerRect.y;

    // const getRBGVal = () => {
    //     return (100 + Math.floor(Math.random() * 155)).toString(16);
    // }

    function hashCode(str: any) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    function getRBGVal(i: any) {
        const val = (50 + mod(hashCode(i), 205)).toString(16);
        return val;
    }

    const color = (i: any) => {
        const ret = "#" + getRBGVal("D" + i.id) +
            getRBGVal("G" + i.id) + getRBGVal("C" + i.id);
        return ret
    };

    const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
        const dragstarted: any = (event: { active: any; }, d: { fx: any; x: any; fy: any; y: any; }) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged: any = (event: { x: any; y: any; }, d: { fx: any; fy: any; }) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragended: any = (event: { active: any; }, d: { fx: null; fy: null; }) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    };

    const div = d3.select("#graph-tooltip");

    const toggleTooltip = (d: any) => {
        if (d.id === selectedToolkitNode) {
            selectedToolkitNode = null;
            removeTooltip();
        } else {
            selectedToolkitNode = d.id;
            addToolTip(d)
        }
    };

    const addToolTip = (d: any) => {
        div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
        div
            .select('#name')
            .text(d.id)

        div
            .select('#count')
            .style("visibility", "visible")

        div
            .select("#avg-rating")
            .style("visibility", "visible")

        div
            .select("#avg-weight")
            .style("visibility", "visible")

        const relatedIngredients = links.filter(
            (link: { source: { id: any; }; }) => link.source.id === d.id
        ).map((link: { target: { id: string; }; count: { toLocaleString: () => string; }; }) => "<li>" + link.target.id + " (" + link.count.toLocaleString() + ")</li>")

        const relatedIngredientsHTML = `<p>Most commonly used with ${d.id}:</p>` +
            "<ol>" +
            relatedIngredients.join("") +
            "</ol>"

        div
            .select('#related')
            .html(relatedIngredientsHTML)

        div
            .select('#related')
            .style("visibility", "visible")

        const numRecipes = d.size.toLocaleString();
        const percentRecipes = Math.round((d.size / 91458.0 * 100) * 100) / 100

        div
            .select('#count')
            .text(`Found ${numRecipes} recipes with this ingredient (${percentRecipes}% of total)`)

        const rating = Math.round((d.avg_rating * 100)) / 100;

        div
            .select('#avg-rating')
            .text(`Recipes with this ingredient have an average rating of ${rating} stars`)
    }

    const removeTooltip = () => {
        div
            .transition()
            .duration(200)
            .style("opacity", 0);
    };

    const simulation: any = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id((d: any) => d.id)
        )
        // @ts-ignore
        .force("charge", d3.forceManyBodyReuse()
            .strength(REPEL_STRENGTH))
        .force("collide", d3.forceCollide())
        .force("x", d3.forceX(ATTRACT_POINT_X))
        .force("y", d3.forceY(ATTRACT_POINT_Y));

    const svg = d3
        .select(container)
        .append("svg")
        .attr("style", "outline: thin solid black;")
        .attr("width", 800).attr("height", 550)
        .attr("class", "graphsvg");

    var selectedToolkitNode: null = null;

    const g = svg.append('g');

    const handleZoom = (e: { transform: string | number | boolean | readonly (string | number)[] | d3.ValueFn<SVGGElement, unknown, string | number | boolean | readonly (string | number)[] | null> | null; }) => g.attr('transform', e.transform);

    const zoom: any = d3.zoom().on('zoom', handleZoom);

    d3.select('svg').call(zoom);

    const link = g
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#000000")
        .attr("stroke-opacity", (d) => d.value)
        .attr("stroke-width", 3);

    const node = g
        // .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => Math.sqrt(d.size) * 0.16)
        .attr("fill", (d) => color(d))
        .call(drag(simulation) as any);

    const label = g
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr("fill", "black")
        .attr("font-size", (d) => Math.floor(Math.sqrt(d.size) * .15))
        .text(d => { return d.id; })
        .call(drag(simulation) as any);

    label.on("click", (event, d) => {
        toggleTooltip(d);
    })

    simulation.on("tick", () => {
        //update link positions
        link
            .attr("x1", d => d.source.x + xOffset)
            .attr("y1", d => d.source.y + yOffset)
            .attr("x2", d => d.target.x + xOffset)
            .attr("y2", d => d.target.y + yOffset);

        // update node positions
        node
            .attr("cx", d => d.x + xOffset)
            .attr("cy", d => d.y + yOffset);

        // update label positions
        label
            .attr("x", d => { return d.x + xOffset; })
            .attr("y", d => { return d.y + yOffset; })
    });

    return {
        destroy: () => {
            simulation.stop();
        },
        nodes: () => {
            return svg.node();
        }
    };
}

// import "@fortawesome/fontawesome-free/css/all.min.css";
// import styles from "./forceGraph.module.css";

export const FoodGraph = () => {
    const [graphData, setGraphData] = useState<any>();

    useEffect(() => {
        fetch("/d3_graph.json").then(response => {
            return response.json();
        }).then(data => {
            // Work with JSON data here
            setGraphData(data);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });
    }, [])

    const containerRef = React.useRef(null);

    React.useEffect(() => {
        let destroyFn;

        if (containerRef.current && graphData) {
            const { destroy } = runForceGraph(containerRef.current, graphData.links, graphData.nodes);
            destroyFn = destroy;
        }

        return destroyFn;
    }, [graphData]);

    return <Container>
        <Row>
            <Col xs={12} md={3}>
                <div id="graph-tooltip">
                    <b><p id="name">
                        Click on a node to see more information.
                        <br></br><br></br>
                        Drag to pan and scroll to zoom.
                        <br></br><br></br>
                        Node area is proportional to the number of
                        recipes containing that ingredient.
                        <br></br>
                        An edge indicates two ingredients are shared
                        in a recipe. Only the top 3 edges are shown.
                    </p></b>
                    <p id="count" style={{ visibility: "hidden" }}></p>
                    <p id="related" style={{ visibility: "hidden" }}></p>
                    <p id="avg-rating" style={{ visibility: "hidden" }}></p>
                    <p id="avg-weight" style={{ visibility: "hidden" }}></p>
                </div>
            </Col>
            <Col>
                <div ref={containerRef} className="svgcontainer" />
            </Col>
        </Row>
    </Container >
};

export default FoodGraph
