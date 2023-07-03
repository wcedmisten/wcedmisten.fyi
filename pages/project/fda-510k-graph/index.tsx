import React, { useEffect, useRef, useState } from "react";

import dynamic from 'next/dynamic';

import style from './fda-510k.module.css'

import { useWindowSize } from "@react-hook/window-size";

const ForceGraph = dynamic(() => import('../../../components/ForceGraph'), {
    ssr: false,
})

const SearchInput = ({ onInputChange }: { onInputChange: (e: any) => void }) => {
    const [searchInput, setSearchInput] = useState("")

    useEffect(() => {
        const getData = setTimeout(() => {
            if (searchInput !== "") {
                onInputChange(searchInput)
            }
        }, 2000)

        return () => clearTimeout(getData)
    }, [searchInput])

    return <input className={style.SearchInput} placeholder="Search for a device" onChange={e => setSearchInput(e.target.value)} />
}

export const DeviceGraph = () => {
    const [graphData, setGraphData] = useState<any>({ links: [], nodes: [] });

    const [selectedNode, setSelectedNode] = useState<string>("K223649");

    const data = "/fda-510k-graph/d3_fda_510k_graph.json"

    useEffect(() => {
        fetch("/fda-510k-graph/d3_fda_510k_graph.json").then(response => {
            return response.json();
        }).then(data => {
            // Work with JSON data here
            setGraphData(data);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });
    }, [])

    const findNode = (nodeId: string) => {
        return graphData.nodes.find((node: { id: string }) => node.id === nodeId)
    }

    const selectedNodeData = graphData.length ? null : findNode(selectedNode)

    const findPredicates = (nodeId: string) => {
        return graphData.links.filter((link: { source: string; target: string }) => link.target === nodeId)
    }

    const findSubgraph = (graphData: { nodes: any[], links: any[] }, nodeId: string) => {
        const seen = new Set()

        const tempEdges = []
        const tempNodes = []

        const device_tree = findPredicates(nodeId)

        tempNodes.push(findNode(nodeId))
        seen.add(nodeId)

        while (device_tree.length) {
            const { target, source } = device_tree.pop()
            if (!seen.has(target)) {
                tempNodes.push(findNode(target))
                seen.add(target)
            }

            if (!seen.has(source)) {
                tempNodes.push(findNode(source))
                seen.add(source)

                const sourcePredicates = findPredicates(source)
                device_tree.push(...sourcePredicates)
                tempEdges.push({ source, target })
            }
        }

        return { nodes: tempNodes, links: tempEdges }
    }

    console.log(graphData, selectedNode)

    const finalData = findSubgraph(graphData, selectedNode);

    const [width, height] = useWindowSize()

    return <>
        <SearchInput onInputChange={setSelectedNode}></SearchInput>
        <div className={style.InfoSection}>
            <span>Device ID: {selectedNode} </span>
            <span>Date Recieved: {selectedNodeData?.date} </span>
            <span>Product Code: <a href={
                `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPCD/classification.cfm?id=${selectedNodeData?.product_code}`
            }>{selectedNodeData?.product_code}</a> </span>
            <span>Generic Name: {graphData?.product_descriptions?.[selectedNodeData?.product_code]}</span>
        </div>

        <ForceGraph
            graphData={finalData}
            nodeLabel={node => `ID: ${node.id}<br>Date: ${node.date}<br>Category: ${node.product_code}`}
            nodeAutoColorBy="product_code"
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            dagMode="radialin"
            width={width - 50}
            height={height - 200}
            dagLevelDistance={20}
            nodeVal={(node: any) => node.id === selectedNode ? 10 : 1}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.id === selectedNode ? 10 : 5, 0, 2 * Math.PI, false);
                ctx.fillStyle = node.color;
                ctx.fill();

                if (node.id === selectedNode) {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#003300';
                    ctx.stroke();
                }

                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
            }}
        />
    </>
};

export default DeviceGraph

export async function getStaticProps() {
    return {
        props: {
            opengraph: {
                title: "FDA 510k Approval Graph",
                image: "https://wcedmisten.fyi/og-images/fda-510k-graph.png",
                type: "website",
                url: "https://wcedmisten.fyi/project/fda-510k-graph/"
            }
        }
    }
}