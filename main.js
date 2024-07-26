import Feature from 'ol/Feature';
import OSM from 'ol/source/OSM.js';
import Point from 'ol/geom/Point';
//import {Circle as Cercle} from 'ol/geom/Circle';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {Map, View} from 'ol';
import {Vector as VectorSource} from 'ol/source';
import Overlay from 'ol/Overlay.js';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import {toStringHDMS} from 'ol/coordinate.js';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';

import Link from 'ol/interaction/Link';

// Definit une source vide
const source = new VectorSource();

// Definit un client pour la lecture de csv
const client = new XMLHttpRequest();
client.open('GET', './data/meteorites.csv');
client.onload = function () {
  // Remplit la source
  const csv = client.responseText;
  const features = [];

  let prevIndex = csv.indexOf('\n') + 1; // scan past the header line

  let curIndex;
  while ((curIndex = csv.indexOf('\n', prevIndex)) != -1) {
    const line = csv.substr(prevIndex, curIndex - prevIndex).split(',');
    prevIndex = curIndex + 1;

    const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
    if (isNaN(coords[0]) || isNaN(coords[1])) {
      // guard against bad data
      continue;
    }
    const point = new Point(coords);

    const style1 = new Style({
      fill: new Fill({
        color: 'red'
        })
      });
 let col = "red";
  if (parseFloat(line[1]) > 1000){ col = "pink"}
  const style =   new Style({
  image: new Circle({
    radius:  7,
    fill: new Fill({
      color: col,
    }),
    stroke: new Stroke({
      color: "blue",
      width:1,
    }),
  }),
  zIndex: Infinity,
});

    const feat =   new Feature({
        name: line[0],
        mass: parseFloat(line[1]) || 0,
        year: parseInt(line[2]) || 0,
        geometry: new Point(coords)});

    feat.setStyle(style);
    features.push(
      feat
    //   new Feature({
    //     name: line[0],
    //     mass: parseFloat(line[1]) || 0,
    //     year: parseInt(line[2]) || 0,
    //     geometry: new Point(coords),
    //   })
     );
  }
  source.addFeatures(features);
};
client.send();


// Definit le layer meteorite
const meteorites = new VectorLayer({
  source: source,
});


// Definit la carte
const map = new Map({
  target: 'map',
  layers: [
      new TileLayer({
        source: new OSM(),
      }),
      meteorites,
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});


// Custom
document
  .querySelectorAll('.ol-zoom-in, .ol-zoom-out, .ol-rotate-reset')
  .forEach(function (el) {
    new bootstrap.Tooltip(el, {
      container: '#map',
    });
  });


// Definit position
const pos = fromLonLat([16.3725, 48.208889]);

// Popup showing the position the user clicked
const popup = new Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup);


// Definit element
const element = document.getElementById('popup');

map.on('click', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  popup.setPosition(coordinate);
  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
  if (feature)  {
    console.log(feature.values_);
    let popover = bootstrap.Popover.getInstance(element);
    if (popover) {
      popover.dispose();
    }
    popover = new bootstrap.Popover(element, {
      animation: false,
      container: element,
      content: '<p>The location you clicked was:</p><code>' + feature.values_.name + '</code>',
      html: true,
      placement: 'top',
      title: 'OpenLayers',
    });
    popover.show();
  }
  else {
    let popover = bootstrap.Popover.getInstance(element);
    if (popover) {
      popover.dispose();
    }
  };
});
//Keep the map view stable:
map.addInteraction(new Link());
