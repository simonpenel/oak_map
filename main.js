import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import OSM from 'ol/source/OSM.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer.js';

const blur = document.getElementById('blur');
const radius = document.getElementById('radius');
const debut = document.getElementById('debut');

const vector = new HeatmapLayer({
  source: new VectorSource({
    url: 'http://localhost:5173/data/2012_Earthquakes_Mag5.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
  debut:  parseInt(debut.value, 10),
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
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

blur.addEventListener('input', function () {
  vector.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener('input', function () {
  vector.setRadius(parseInt(radius.value, 10));
});

debut.addEventListener('input', function () {
console.log(parseInt(debut.value, 10));

  if (parseInt(debut.value, 10) > 50) {
  vector.setRadius(10);
  
  //vector.setRadius(parseInt(debut.value, 10));
  }
  else {
  vector.setRadius(1);
  }
});



