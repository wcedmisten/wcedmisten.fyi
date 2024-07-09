import Head from "next/head"
import { useEffect, useRef, useState } from "react"

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";
import layer from "./positron_style.json"
import hospitals from "./hospitals_layer.json"

// const [initialLon, initialLat] = [41.1533, 20.1683]
const [initialLon, initialLat] = [-76.5059133431, 37.6227077717]

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map>();

  const popup = useRef<maplibregl.Popup>();

  const [lng] = useState(initialLon);
  const [lat] = useState(initialLat);

  const [zoom] = useState(4);

  useEffect(() => {
    if (map.current) return;

    let protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    map.current = new maplibregl.Map({
      container: mapContainer.current as any,
      style: {
        glyphs: "/virginia-hospital-distance/glyphs/{fontstack}/{range}.pbf",
        version: 8,
        "sources": {
          "openmaptiles": {
            "type": "vector",
            "url": "https://virginia-tiles.wcedmisten.dev/virginia-2024-07-06.json"
          },
          "isochrone": {
            "type": "vector",
            "url": "pmtiles:///virginia-hospital-distance/virginia_iso.pmtiles",
          },
          "hospitals": {
            "type": "geojson",
            "data": hospitals
          },
        },
        layers: layer as any,
      },
      center: [lng, lat],
      zoom: zoom,
      minZoom: 4,
      // maxBounds: [
      //   [-84.71490710282056,
      //     35.77320086387027],
      //   [-73.94080914265395,
      //     39.73148308878754]],
      customAttribution: ["© OpenMapTiles", "© OpenStreetMap contributors"],
    });

    if (!popup.current) {
      // Create a popup, but don't add it to the map yet.
      popup.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });
    }

    map.current.loadImage(
      '/virginia-hospital-distance/hospital-solid.png',
      // Add an image to use as a custom marker
      function (error, image: any) {
        if (error) throw error;
        map.current?.addImage('hospitalMarker', image);
      })

    map.current.fitBounds([
      [
        -83.79043169282795,
        36.53531313954011
      ], // southwestern corner of the bounds
      [
        -74.96413368319128,
        39.511129595313434
      ], // northeastern corner of the bounds
    ]);
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div id="state-legend" className="legend">
        <h2>Driving Time to Nearest Hospital</h2>
        <div className="legend-group">
          <div className="legend-element">
            <span className="legend-color" style={{ backgroundColor: "#b5e425" }} />&lt; 10 mins</div>
          <div className="legend-element"><span className="legend-color" style={{ backgroundColor: "#41847c" }}></span>10-20 mins</div>
        </div>
        <div className="legend-group">
          <div className="legend-element"><span className="legend-color" style={{ backgroundColor: "#657188" }}></span>20-30 mins</div>
          <div className="legend-element"><span className="legend-color" style={{ backgroundColor: "#c2aac2" }}></span>30-40 mins</div>
          <div className="legend-element"><span className="legend-color" style={{ backgroundColor: "white" }}></span>&gt; 40 mins</div>
        </div>
      </div>
    </div>
  );
}


export default function Isochrone() {
  return (
    <>
      <Head>
        <title>Virginia Hospital Accessibility Map</title>
        <meta name="description" content="A map visualizing the travel time by car to the nearest hospital in Virginia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Map></Map>
      </main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      opengraph: {
        title: "Drive Time to Nearest Hospital in Virginia",
        image: "https://wcedmisten.fyi/og-images/virginia-hospital-distance.png",
        type: "website",
        url: "https://wcedmisten.fyi/project/virginia-hospital-distance"
      }
    }
  }
}