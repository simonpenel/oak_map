import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer.js';

const blur = document.getElementById('blur');
const radius1 = document.getElementById('radius1');
const radius2 = document.getElementById('radius2');

const vector1 = new HeatmapLayer({
  source: new VectorSource({
    url: 'http://localhost:5173/data/2012_Earthquakes_Mag5.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  blur: parseInt(blur.value, 10),
  radius1: parseInt(radius1.value, 10),
  weight: function (feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    const name = feature.get('name');
    const magnitude = parseFloat(name.substr(2));
    return magnitude - 5;
  },
});


const vector2 = new HeatmapLayer({
  source: new VectorSource({
    url: 'http://localhost:5173/data/2012_Earthquakes_Mag5.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  blur: parseInt(blur.value, 10),
  radius2: parseInt(radius2.value, 10),
  weight: function (feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    const name = feature.get('name');
    const magnitude = parseFloat(name.substr(2));
    return magnitude - 5;
  },
});

const raster = new TileLayer({
  source: new StadiaMaps({
    layer: 'stamen_toner',
  }),
});

new Map({
  layers: [raster, vector1,vector2],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

blur.addEventListener('input', function () {
  vector1.setBlur(parseInt(blur.value, 10));
});

blur.addEventListener('input', function () {
  vector2.setBlur(parseInt(blur.value, 10));
});


radius1.addEventListener('input', function () {
  vector1.setRadius(parseInt(radius1.value, 10));
});

radius2.addEventListener('input', function () {
  vector2.setRadius(parseInt(radius2.value, 10));
});
