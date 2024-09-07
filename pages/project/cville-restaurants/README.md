# osmium sidewalk extract

```
osmium tags-filter ~/Downloads/virginia-latest.osm.pbf -o virginia-sidewalks.osm.pbf nw/highway=footway nw/highway=path nw/highway=pedestrian

osmium extract virginia-sidewalks.osm.pbf --polygon /home/wcedmisten/repos/wcedmisten.fyi/pages/project/cville-planned-sidewalks/cville.json -o cville-sidewalks.osm.pbf

osmium export cville-sidewalks.osm.pbf -o cville-sidewalks.geojson

tippecanoe -o cville-sidewalks.mbtiles cville-sidewalks.geojson --force

~/Downloads/pmtiles convert cville-sidewalks.mbtiles cville-sidewalks.pmtiles

cp cville-sidewalks.pmtiles ~/repos/wcedmisten.fyi/public/
```
