import React from 'react';
import axios from 'axios';

import { Map, Feature, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
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
    let url = 'https://tumbleweed-go-backend.herokuapp.com/tumbleweed/get';
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
    for (let i = -1; i < 6; i++) {
      tumbleweedLayers.push(this.setSingleTumbleweedLayer(data, i));
    }
    console.log(tumbleweedLayers);
    this.setState({
      tumbleweedLayers: tumbleweedLayers,
      currentTumbleweedLayer: tumbleweedLayers[0]  // Set starting tumbleweed layer.
    });
  }

  setSingleTumbleweedLayer = (data, index) => {

    let style = new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#e3af2b'
        }),
        stroke: new Stroke({
          color: '#b28921'
        })
      })
    });

    let pts = data.map(point => {

      let longitude, latitude;
      if (index === -1) {
        latitude = point.location._lat;
        longitude = point.location._long;
      }
      else {
        latitude = point.predictedLocations[index]._lat;
        longitude = point.predictedLocations[index]._long;
      }
      
      return new Feature({
        geometry: new Point(fromLonLat([
          longitude, latitude
        ]))
      });
    });

    return new VectorLayer({
      source: new VectorSource({ features: pts }),
      style: style
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
        maxZoom: 11 // TODO: Change
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
