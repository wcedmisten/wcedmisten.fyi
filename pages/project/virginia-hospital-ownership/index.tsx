import Head from "next/head"
import { useEffect, useRef, useState } from "react"

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";
import layer from "./positron_style.json"
import hospitals from "./hospitals_layer.json"
import voronoi from "./voronoi.json"
import Accordion from 'react-bootstrap/Accordion';

// const [initialLon, initialLat] = [41.1533, 20.1683]
const [initialLon, initialLat] = [-76.5059133431, 37.6227077717];

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

  const [zoom] = useState(4);

  const [showInfoModal, setShowInfoModal] = useState(false);

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
            "url": "pmtiles:///virginia-hospital-distance/virginia.pmtiles"
          },
          "hospitals": {
            "type": "geojson",
            "data": hospitals
          },
          "voronoi": {
            "type": "geojson",
            "data": voronoi
          }
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
      customAttribution: ["© OpenMapTiles", "© OpenStreetMap"],
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

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.current.on('click', 'voronoi', (e) => {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e?.features?.[0]?.properties?.operator)
        .addTo(map.current as any);

      if (e?.features?.[0]?.properties?.operator === "UNKNOWN") {
        (map.current as any).setPaintProperty(
          "voronoi",
          'fill-opacity',
          ['match', ['get', 'name'], e?.features?.[0]?.properties?.name, 0.5, 0.1]
        );
      } else {
        (map.current as any).setPaintProperty(
          "voronoi",
          'fill-opacity',
          ['match', ['get', 'operator'], e?.features?.[0]?.properties?.operator, 0.5, 0.1]
        );
      }

    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.current.on('mouseenter', 'voronoi', (e) => {
      (map.current as any).getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mousemove', 'voronoi', (e) => {
      (map.current as any).setPaintProperty(
        "voronoi",
        'fill-opacity',
        ['match', ['get', 'operator'], e?.features?.[0]?.properties?.operator, 0.5, 0.1]
      );
    });


    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'voronoi', () => {
      (map.current as any).getCanvas().style.cursor = '';
      (map.current as any).setPaintProperty(
        "voronoi",
        'fill-opacity',
        0.5
      );
    });

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

  const colorMap: any = {}

  voronoi.features.forEach((e) => {
    if (e.properties.operator !== "UNKNOWN") {
      colorMap[e.properties.operator] = e.properties.color
    }
  })

  return (
    <div className="map-wrap">
      <InfoModal show={showInfoModal} handleClose={() => setShowInfoModal(false)}></InfoModal>
      <div ref={mapContainer} className="map" />
      <div id="state-legend" className="legend">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Hospital Territory Map</Accordion.Header>
            <Accordion.Body>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => { setShowInfoModal(!showInfoModal) }}
              >About ⓘ</p>
              <p>Hospital Operators (click to focus)</p>
              <div className="legend-group">
                {Object.entries(colorMap).map(([operator, color]) => {
                  return <><div className="legend-element"
                    onClick={() => {
                      map.current?.setPaintProperty(
                        "voronoi",
                        'fill-opacity',
                        ['match', ['get', 'operator'], operator, 0.5, 0.1]
                      );
                    }}>
                    <span
                      onClick={() => {
                        map.current?.setPaintProperty(
                          "voronoi",
                          'fill-opacity',
                          ['match', ['get', 'operator'], operator, 0.5, 0.1]
                        );
                      }}
                      className="legend-color"
                      style={{ backgroundColor: color as any }} />{operator}</div>
                  </>
                })}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </div>
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