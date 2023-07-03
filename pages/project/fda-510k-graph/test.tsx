import { useEffect } from "react";
import { createDbWorker } from "sql.js-httpvfs"

export const Test = () => {
    useEffect(() => {
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
            const result = await worker.db.exec(`explain query plan WITH RECURSIVE
            ancestor(n) AS (
              VALUES(?)
              UNION ALL
              SELECT node_from FROM predicate_graph_edge, ancestor
               WHERE predicate_graph_edge.node_to=ancestor.n
            )
            SELECT * FROM predicate_graph_edge
            JOIN device ON node_from = device.k_number WHERE predicate_graph_edge.node_to IN ancestor;`, ["K223649"]);

            // worker.worker.bytesRead is a Promise for the number of bytes read by the worker.
            // if a request would cause it to exceed maxBytesToRead, that request will throw a SQLite disk I/O error.
            console.log(await worker.worker.bytesRead);
            console.log(result);

            // you can reset bytesRead by assigning to it:
            worker.worker.bytesRead = 0;
        }

        fetchData()
            // make sure to catch any error
            .catch(console.error);
    })


    return <p>test</p>
}

export default Test