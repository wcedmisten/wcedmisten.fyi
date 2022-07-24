import * as d3 from "d3";
import React, { useEffect, useState } from "react";

import { Col, Row, Container } from 'react-bootstrap';

// graph dynamic constants
const REPEL_STRENGTH = -500
const ATTRACT_POINT_X = 250
const ATTRACT_POINT_Y = 150

function runForceGraph(
    container,
    linksData,
    nodesData,
    nodeHoverTooltip
) {
    const links = linksData.map((d) => Object.assign({}, d));
    const nodes = nodesData.map((d) => Object.assign({}, d));


    const containerRect = container.getBoundingClientRect();

    console.log(containerRect)
    const height = containerRect.height;
    const width = containerRect.width;

    const xOffset = containerRect.x;
    const yOffset = containerRect.y;

    console.log(width, height);

    const getRBGVal = () => {
        return (100 + Math.floor(Math.random() * 155)).toString(16);
    }

    const color = () => {
        const ret = "#" + getRBGVal() + getRBGVal() + getRBGVal();
        console.log(ret);
        return ret
    };

    const drag = (simulation) => {
        const dragstarted = (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragended = (event, d) => {
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

    // Add the tooltip element to the graph
    const tooltip = document.querySelector("#graph-tooltip");
    // if (!tooltip) {
    //     const tooltipDiv = document.createElement("div");
    //     tooltipDiv.classList.add("tooltip");
    //     tooltipDiv.style.opacity = "0";
    //     tooltipDiv.id = "graph-tooltip";
    //     document.body.appendChild(tooltipDiv);
    // }
    const div = d3.select("#graph-tooltip");

    const toggleTooltip = (hoverTooltip, d, x, y) => {
        console.log(d)

        if (d.id === selectedToolkitNode) {
            selectedToolkitNode = null;
            removeTooltip();
        } else {
            selectedToolkitNode = d.id;
            addToolTip(hoverTooltip, d, x, y)
        }
    };

    const addToolTip = (hoverTooltip, d, x, y) => {
        div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
        div
            .html(hoverTooltip(d))
    }

    const removeTooltip = () => {
        div
            .transition()
            .duration(200)
            .style("opacity", 0);
    };

    const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links)
            .id(d => d.id)
            // .strength((d) => d.value))
        )
        .force("charge", d3.forceManyBody().strength(REPEL_STRENGTH))
        .force("collide", d3.forceCollide())
        .force("x", d3.forceX(ATTRACT_POINT_X))
        .force("y", d3.forceY(ATTRACT_POINT_Y));

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", 800).attr("height", 600)
        .attr("class", "graphsvg");

    var selectedToolkitNode = null;

    const g = svg.append('g');

    const handleZoom = (e) => g.attr('transform', e.transform);

    const zoom = d3.zoom().on('zoom', handleZoom);

    d3.select('svg').call(zoom);

    const link = g
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#000000")
        .attr("stroke-opacity", (d) => d.value)
        .attr("stroke-width", 2);

    const node = g
        // .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => Math.sqrt(d.size) * 1.6)
        .attr("fill", color)
        .call(drag(simulation));

    const label = g
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr("fill", "black")
        .attr("font-size", (d) => Math.floor(Math.sqrt(d.size) * 1.5))
        .text(d => { return d.id; })
        .call(drag(simulation));

    label.on("click", (event, d) => {
        toggleTooltip(nodeHoverTooltip, d, event.pageX, event.pageY);
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
            console.log(response);
            return response.json();
        }).then(data => {
            // Work with JSON data here
            console.log(data);
            setGraphData(data);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });
    }, [])


    const nodeHoverTooltip = React.useCallback((node) => {
        return `<div>${node.id}</div>`;
    }, []);

    const containerRef = React.useRef(null);

    React.useEffect(() => {
        let destroyFn;

        if (containerRef.current && graphData) {
            const { destroy } = runForceGraph(containerRef.current, graphData.links, graphData.nodes, nodeHoverTooltip);
            destroyFn = destroy;
        }

        return destroyFn;
    }, [graphData]);

    return <Container>
        <Row>
            <Col xs={12} md={2}>
                <div id="graph-tooltip"><p>Click on a node to see more.</p></div>
            </Col>
            <Col>
                <div ref={containerRef} className="container" />
            </Col>
        </Row>
    </Container>
};

export default FoodGraph
