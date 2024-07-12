import Head from "next/head"
import { useEffect, useRef, useState } from "react"

import * as d3 from "d3";

import maplibregl from "maplibre-gl";
import layer from "./positron_style.json"
import sidewalks from "./sidewalks.json"
import cville from "./cville.json"

import colormap from 'colormap';

const [initialLon, initialLat] = [-78.47932503996893, 38.030451563032585];


const popupHtml = (properties: any) => {
  const street = `<p>🛣️ Street: <b>${properties.Street}</b></p>`
  const cost = `<p>💲 Total Cost: <b>${properties["Total Cost"].replace(" ", "")}</b></p>`
  const length = `<p>📏 Length: <b>${properties["Length (ft)"].toLocaleString()} feet</b></p>`
  const year = `<p>📅 Construction Begins: <b>${properties["Engineering/Construction Begins (Fiscal Year)"]}</b></p>`
  const tier = `<p>💪 Difficulty Tier*: <b>${properties["Tier"]}</b></p>`
  const explanation = "<br>* Tier 1 is the easiest/cheapest and Tier 3 is the hardest/most expensive. <a href=\"https://charlottesville.gov/1764/Sidewalk-Priorities\" >More info</a>"

  return street + cost + length + year + tier + explanation;
}

const DEFAULT_COLOR = "#C5001A"

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map>();

  const popup = useRef<maplibregl.Popup>();

  const [lng] = useState(initialLon);
  const [lat] = useState(initialLat);

  const [zoom] = useState(12);

  const [colorBy, setColorBy] = useState<string | null>();

  const findColor = (colorBy: any, properties: any) => {
    if (colorBy === null) {
      return DEFAULT_COLOR
    }

    const vals = sidewalks.features.map(f => (f.properties as any)[colorBy]);

    let bins: any = [];
    switch (colorBy) {
      case "Total Cost":
        bins = d3.bin().thresholds([0, 50000, 100000, 150000, 200000])(vals);
      case "Engineering/Construction Begins (Fiscal Year)":
        bins = d3.bin().thresholds([2024, 2025, 2026, 2027, 2028, 2029, 2030])(vals);
      case "Length (ft)":
        bins = d3.bin()(vals);
    };

    const findBin = (val: any, bins: any[]) => {
      for (let idx = 0; idx < bins.length; idx++) {
        const b = bins[idx]
        if (b.x0 > val) {
          return idx - 1
        }
      }

      return bins.length - 1;
    }

    const colors = colormap({
      colormap: 'viridis',
      nshades: Math.max(bins.length, 10),
      format: 'hex',
      alpha: 1
    })

    return DEFAULT_COLOR

    if (colorBy === null) {
      return DEFAULT_COLOR
    }

    if (properties[colorBy] === -1) {
      return "#000000"
    } else {
      return colors[findBin(properties[colorBy], bins)]
    }
  }

  const sidewalksWithColor = {
    ...sidewalks,
    features: sidewalks.features.map(f => {
      return {
        ...f, properties: {
          ...f.properties, color: findColor(colorBy, f.properties)
        }
      }
    })
  }

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
            "url": "https://virginia-tiles.wcedmisten.dev/virginia-2024-07-06.json",
            "maxzoom": 14
          },
          "sidewalks": {
            "type": "geojson",
            "data": sidewalksWithColor as any
          },
          "cville": {
            "type": "geojson",
            "data": cville as any
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
    });

    map.current.addControl(new maplibregl.AttributionControl({ customAttribution: "© OpenMapTiles © OpenStreetMap" }), 'bottom-left');

    if (!popup.current) {
      // Create a popup, but don't add it to the map yet.
      popup.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });
    }

    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.current.on('click', 'sidewalks', (e: any) => {
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupHtml(e?.features?.[0]?.properties))
        .addTo(map.current as any);

      // Geographic coordinates of the LineString
      const coordinates: any = e?.features?.[0].geometry.type === "MultiLineString" ? e?.features?.[0].geometry.coordinates.flat() : e?.features?.[0].geometry.coordinates;

      // Pass the first coordinates in the LineString to `lngLatBounds` &
      // wrap each coordinate pair in `extend` to include them in the bounds
      // result. A variation of this technique could be applied to zooming
      // to the bounds of multiple Points or Polygon geometries - it just
      // requires wrapping all the coordinates with the extend method.
      const bounds = coordinates.reduce((bounds: any, coord: any) => {
        return bounds.extend(coord);
      }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

      map?.current?.fitBounds(bounds, {
        padding: 40
      });
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.current.on('mouseenter', 'sidewalks', (e) => {
      (map.current as any).getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'sidewalks', (e) => {
      (map.current as any).getCanvas().style.cursor = 'default';
    });

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

  }, [sidewalksWithColor]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
      <div id="state-legend" className="legend">
        <h3>Planned Sidewalks in Charlottesville</h3>
        <p>Data adapted from <a href="https://charlottesvilleva.portal.civicclerk.com/event/2030/files/attachment/5197">charlottesville.gov</a></p>
      </div>
    </div>
  );
}


export default function Isochrone() {
  return (
    <>
      <Head>
        <title>Charlottesville Planned Sidewalks</title>
        <meta name="description" content="A map of planned sidewalks in Charlottesville, Virginia." />
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
        title: "Charlottesville Planned Sidewalks",
        image: "https://wcedmisten.fyi/og-images/cville-planned-sidewalks.png",
        type: "website",
        url: "https://wcedmisten.fyi/project/cville-planned-sidewalks"
      }
    }
  }
}