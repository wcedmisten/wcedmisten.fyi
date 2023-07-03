import React, { useEffect, useRef, useState } from "react";

import dynamic from 'next/dynamic';

import style from './fda-510k.module.css'

import { createDbWorker } from "sql.js-httpvfs"

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

const fetchSelectedNodeData = async () => {
    // sadly there's no good way to package workers and wasm directly so you need a way to get these two URLs from your bundler.
    // This is the webpack5 way to create a asset bundle of the worker and wasm:
    const workerUrl = new URL(
        "sql.js-httpvfs/dist/sqlite.worker.js",
        import.meta.url,
    );
    const wasmUrl = new URL(
        "sql.js-httpvfs/dist/sql-wasm.wasm",
        import.meta.url,
    );
    // the legacy webpack4 way is something like `import wasmUrl from "file-loader!sql.js-httpvfs/dist/sql-wasm.wasm"`.

    // the config is either the url to the create_db script, or a inline configuration:
    const config: any = {
        from: "inline",
        config: {
            serverMode: "full", // file is just a plain old full sqlite database
            requestChunkSize: 4096, // the page size of the  sqlite database (by default 4096)
            url: "/fda-510k-graph/devices-prepared.db" // url to the database (relative or full)
        }
    };

    let maxBytesToRead = 10 * 1024 * 1024;

    const worker = await createDbWorker(
        [config],
        workerUrl.toString(),
        wasmUrl.toString(),
        maxBytesToRead // optional, defaults to Infinity
    );
    // you can also pass multiple config objects which can then be used as separate database schemas with `ATTACH virtualFilename as schemaname`, where virtualFilename is also set in the config object.

    // worker.db is a now SQL.js instance except that all functions return Promises.

    // explain query plan 
    const result = await worker.db.exec(`SELECT * FROM DEVICE WHERE k_number = ?;`, ["K223649"]);

    // worker.worker.bytesRead is a Promise for the number of bytes read by the worker.
    // if a request would cause it to exceed maxBytesToRead, that request will throw a SQLite disk I/O error.
    console.log(await worker.worker.bytesRead);
    // console.log(result);

    // you can reset bytesRead by assigning to it:
    worker.worker.bytesRead = 0;

    const row = result[0].values[0]

    console.log("row", row)

    return {
        id: row[0],
        date: row[1],
        generic_name: row[2],
        name: row[3],
        product_code: row[4]
    }
}


const fetchData = async () => {
    // sadly there's no good way to package workers and wasm directly so you need a way to get these two URLs from your bundler.
    // This is the webpack5 way to create a asset bundle of the worker and wasm:
    const workerUrl = new URL(
        "sql.js-httpvfs/dist/sqlite.worker.js",
        import.meta.url,
    );
    const wasmUrl = new URL(
        "sql.js-httpvfs/dist/sql-wasm.wasm",
        import.meta.url,
    );
    // the legacy webpack4 way is something like `import wasmUrl from "file-loader!sql.js-httpvfs/dist/sql-wasm.wasm"`.

    // the config is either the url to the create_db script, or a inline configuration:
    const config: any = {
        from: "inline",
        config: {
            serverMode: "full", // file is just a plain old full sqlite database
            requestChunkSize: 16384, // the page size of the  sqlite database (by default 4096)
            url: "/fda-510k-graph/devices-prepared.db" // url to the database (relative or full)
        }
    };

    let maxBytesToRead = 10 * 1024 * 1024;

    const worker = await createDbWorker(
        [config],
        workerUrl.toString(),
        wasmUrl.toString(),
        maxBytesToRead // optional, defaults to Infinity
    );
    // you can also pass multiple config objects which can then be used as separate database schemas with `ATTACH virtualFilename as schemaname`, where virtualFilename is also set in the config object.

    // worker.db is a now SQL.js instance except that all functions return Promises.

    // explain query plan 
    const result = await worker.db.exec(`WITH RECURSIVE
    ancestor(n) AS (
      VALUES(?)
      UNION ALL
      SELECT node_from FROM predicate_graph_edge, ancestor
       WHERE predicate_graph_edge.node_to=ancestor.n
    )
    SELECT node_from,node_to,k_number,date_received,generic_name,device_name,product_code FROM predicate_graph_edge
    JOIN device ON node_from = device.k_number WHERE predicate_graph_edge.node_to IN ancestor;`, ["K223649"]);

    // worker.worker.bytesRead is a Promise for the number of bytes read by the worker.
    // if a request would cause it to exceed maxBytesToRead, that request will throw a SQLite disk I/O error.
    console.log(await worker.worker.bytesRead);
    // console.log(result);

    // you can reset bytesRead by assigning to it:
    worker.worker.bytesRead = 0;

    const seenLinks = new Set()

    const links = result[0].values.map((row) => {
        const key = row[0] + "|" + row[1]
        if (seenLinks.has(key)) {
            return null
        }
        seenLinks.add(key)
        return { source: row[0], target: row[1] }
    }).filter((x: any) => x != null)

    const seenNodes = new Set()

    const nodes = result[0].values.map((row) => {
        if (seenNodes.has(row[2])) {
            return null
        }
        seenNodes.add(row[2])
        return {
            id: row[2],
            date: row[3],
            generic_name: row[4],
            name: row[5],
            product_code: row[6]
        }
    }).filter((x: any) => x != null)

    return { nodes, links }
}

export const DeviceGraph = () => {
    const [graphData, setGraphData] = useState<any>({ links: [], nodes: [] });

    const [selectedNode, setSelectedNode] = useState<string>("K223649");
    const [selectedNodeData, setSelectedNodeData] = useState({});

    useEffect(() => {
        fetchData().then(data => {
            // Work with JSON data here
            console.log(data)
            setGraphData(data);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });

        fetchSelectedNodeData().then(data => {
            // Work with JSON data here
            console.log(data)
            setSelectedNodeData(data);
        }).catch(err => {
            // Do something for an error here
            console.log("Error Reading data " + err);
        });
    }, [])

    const finalGraphData = graphData.nodes.length && selectedNodeData ? {nodes: [...graphData.nodes, selectedNodeData], links: graphData.links} : null;

    console.log(finalGraphData)

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

        {finalGraphData ? <ForceGraph
            graphData={finalGraphData}
            nodeLabel={node => `Name: ${node.name}<br>ID: ${node.id}<br>Date: ${node.date}<br>Category: ${node.product_code}`}
            nodeAutoColorBy="product_code"
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            dagMode="radialin"
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
        /> : <p>Loading...</p>}
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