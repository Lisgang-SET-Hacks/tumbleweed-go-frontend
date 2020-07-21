import React from 'react';
import axios from 'axios';

import { Map, Feature, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM as OSMSource, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

import 'ol/ol.css';

class OLMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tumbleweedLayers: [],
      currentTumbleweedLayer: null
    }
    this.map = null;
    this.mapRef = React.createRef();
  }

  getData = (cb) => {
    let url = 'https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/get';
    axios.get(url).then(res => {
      if (res.status && res.status === 200) {
        cb(res.data.result);
      }
      else {
        console.log('rip ' + res.status);
      }
    }).catch(err => {
      console.log('big rip ' + err);
    });
  }

  setAllTumbleweedLayers = (data) => {
    let tumbleweedLayers = [];
    for (let i = 0; i < this.props.sliderRange; i++) {
      tumbleweedLayers.push(this.setSingleTumbleweedLayer(data, i - 1));
    }
    this.setState({
      tumbleweedLayers: tumbleweedLayers,
      currentTumbleweedLayer: tumbleweedLayers[0]  // Set starting tumbleweed layer.
    });
  }

  setSingleTumbleweedLayer = (data, index) => {

    let currentTumbleweedStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#e3af2b' }),
        stroke: new Stroke({ color: '#b28921' })
      })
    });

    let pastTumbleweedStyle = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#e2cf9e' }),
        stroke: new Stroke({ color: '#b2a37c' })
      })
    });

    let pathStyle = new Style({
      stroke: new Stroke({ color: '#b28921', width: 3 })
    });

    // Draw tumbleweed points.

    let features = data.map((point, i) => {

      let style = currentTumbleweedStyle;

      let longitude, latitude;
      if (index === -1) {
        latitude = point.location._lat;
        longitude = point.location._long;
      }
      else if (point.predictedLocations.length === 0) {
        latitude = point.location._lat;
        longitude = point.location._long;
        style = pastTumbleweedStyle;
      }
      else if (index < point.predictedLocations.length) {
        latitude = point.predictedLocations[index]._lat;
        longitude = point.predictedLocations[index]._long;
      }
      else {
        latitude = point.predictedLocations[point.predictedLocations.length - 1]._lat;
        longitude = point.predictedLocations[point.predictedLocations.length - 1]._long;
        style = pastTumbleweedStyle;
      }

      let feature = new Feature({
        geometry: new Point(fromLonLat([
          longitude, latitude
        ]))
      });
      feature.setStyle(style);
      return feature;
    });

    // Draw predition lines.

    if (index !== -1) {
      // Loop day by day.
      for (let j = 0; j <= index; j++){
        // Loop through tumbleweeds.
        data.forEach(point => {
          // Only draw prediction lines if predictions extend far enough.
          if (j < point.predictedLocations.length) {
            let lat1 = j === 0 ? point.location._lat : point.predictedLocations[j - 1]._lat;
            let lon1 = j === 0 ? point.location._long : point.predictedLocations[j - 1]._long;
            let lat2 = point.predictedLocations[j]._lat;
            let lon2 = point.predictedLocations[j]._long;

            let feature = new Feature({
              geometry: new LineString([
                fromLonLat([ lon1, lat1 ]),
                fromLonLat([ lon2, lat2 ])
              ])
            });
            feature.setStyle(pathStyle);
            features.push(feature);
          }
        });
      }
    }

    return new VectorLayer({
      source: new VectorSource({ features: features })
    });
  }

  initMap = () => {

    let raster = new TileLayer({
      source: new OSMSource()
    });
    
    this.map = new Map({
      layers: [ raster, this.state.currentTumbleweedLayer ],
      target: this.mapRef.current,
      view: new View({
        center: fromLonLat([ -110, 46 ]),
        zoom: 4,
        minZoom: 4,
        maxZoom: 11
      })
    });
  }

  showTumbleweedLayer = (index) => {
    this.map.removeLayer(this.state.currentTumbleweedLayer);
    this.map.addLayer(this.state.tumbleweedLayers[index]);
    this.setState({
      currentTumbleweedLayer: this.state.tumbleweedLayers[index]
    });
  }

  componentDidMount() {

    this.getData(data => {
      this.setAllTumbleweedLayers(data);
      this.initMap();
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.day !== this.props.day) {
      this.showTumbleweedLayer(this.props.day);
    }
  }

  render(){
    return (
      <div ref={this.mapRef} className='map' />
    )
  }
}
export default OLMap;
