import Head from "next/head"
import { useEffect, useRef, useState } from "react"

import Modal from 'react-bootstrap/Modal';

import maplibregl from "maplibre-gl";
import layer from "./positron_style.json"
import sidewalks from "./sidewalks.json"

const [initialLon, initialLat] = [-78.47932503996893, 38.030451563032585];

function InfoModal({ show, handleClose }: { show: boolean; handleClose: any }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This project uses OpenStreetMap data to find all the hospitals in Virginia and
          calculates a{' '}
          <a href="https://en.wikipedia.org/wiki/Voronoi_diagram" target="_blank">voronoi diagram</a>
          {' '}
          to show the region that is closest to each hospital,
          representing a hospital's "territory".
        </p>
        <p>Regions are color-coded by the hospital network that runs the hospital.</p>
        <p>This shows which areas have more competition between hospital networks.</p>

        <p>For example, we can see the large swath of Southwest Virginia which is operated
          by Ballad Health, which was recently featured in an{' '}
          <a href="https://kffhealthnews.org/news/article/ballad-health-er-wait-times-copa-monopoly-appalachia-hospitals/"
            target="_blank"
          >
            article about increased ER wait times
          </a>.
        </p>
      </Modal.Body>
    </Modal>
  );
}


const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map>();

  const popup = useRef<maplibregl.Popup>();

  const [lng] = useState(initialLon);
  const [lat] = useState(initialLat);

  const [zoom] = useState(12);

  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as any,
      style: {
        version: 8,
        glyphs: "/map-fonts/{fontstack}/{range}.pbf",
        "sources": {
          "openmaptiles": {
            "type": "vector",
            "tiles": ["https://virginia-tiles.wcedmisten.dev/virginia-2024-07-06/{z}/{x}/{y}.mvt"],
            "maxzoom": 14
          },
          "sidewalks": {
            "type": "geojson",
            "data": sidewalks as any
          }
        },
        layers: layer as any,
      },
      center: [lng, lat],
      zoom: zoom,
      sprite: [
        {
          "id": "circle-11",
          "url": "/map-icons"
        }
      ],
      minZoom: 4,
      // maxBounds: [
      //   [-84.71490710282056,
      //     35.77320086387027],
      //   [-73.94080914265395,
      //     39.73148308878754]],
      customAttribution: ["© OpenMapTiles", "© OpenStreetMap"],
    });

    // if (!popup.current) {
    //   // Create a popup, but don't add it to the map yet.
    //   popup.current = new maplibregl.Popup({
    //     closeButton: false,
    //     closeOnClick: false
    //   });
    // }

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    // map.current.on('click', 'sidewalks', (e) => {
    //   new maplibregl.Popup()
    //     .setLngLat(e.lngLat)
    //     .setHTML(e?.features?.[0]?.properties?.operator)
    //     .addTo(map.current as any);

    //   if (e?.features?.[0]?.properties?.operator === "UNKNOWN") {
    //     (map.current as any).setPaintProperty(
    //       "sidewalks",
    //       'fill-opacity',
    //       ['match', ['get', 'name'], e?.features?.[0]?.properties?.name, 0.5, 0.1]
    //     );
    //   } else {
    //     (map.current as any).setPaintProperty(
    //       "sidewalks",
    //       'fill-opacity',
    //       ['match', ['get', 'operator'], e?.features?.[0]?.properties?.operator, 0.5, 0.1]
    //     );
    //   }

    // });

    // Change the cursor to a pointer when the mouse is over the states layer.
    // map.current.on('mouseenter', 'sidewalks', (e) => {
    //   (map.current as any).getCanvas().style.cursor = 'pointer';
    // });

    // map.current.on('mousemove', 'sidewalks', (e) => {
    //   (map.current as any).setPaintProperty(
    //     "sidewalks",
    //     'fill-opacity',
    //     ['match', ['get', 'operator'], e?.features?.[0]?.properties?.operator, 0.5, 0.1]
    //   );
    // });


    // Change it back to a pointer when it leaves.
    // map.current.on('mouseleave', 'sidewalks', () => {
    //   (map.current as any).getCanvas().style.cursor = '';
    //   (map.current as any).setPaintProperty(
    //     "sidewalks",
    //     'fill-opacity',
    //     0.5
    //   );
    // });

    map.current.fitBounds([
      [
        -78.53683017502908,
          38.0024813672151
      ], // southwestern corner of the bounds
      [
        -78.43743951937498,
          38.07029795409187
      ], // northeastern corner of the bounds
    ]);

  });

  return (
    <div className="map-wrap">
      <InfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)}></InfoModal>
      <div ref={mapContainer} className="map" />
    </div>
  );
}


export default function Isochrone() {
  return (
    <>
      <Head>
        <title>Virginia Hospital Territory Map</title>
        <meta name="description" content="A map of hospital territory in Virginia and who controls it." />
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
        title: "Hospital Ownership in Virginia",
        image: "https://wcedmisten.fyi/og-images/virginia-hospital-ownership.png",
        type: "website",
        url: "https://wcedmisten.fyi/project/virginia-hospital-ownership"
      }
    }
  }
}