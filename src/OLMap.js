import React from 'react';

import { Feature, Map, View } from 'ol';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';

import 'ol/ol.css';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM as OSMSource, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Style } from 'ol/style';

import axios from 'axios';

class OLMap extends React.Component {

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

  getPointsLayer = (data) => {

    let style = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: '#e3af2b'
        })
      })
    });

    let pts = data.map(point => {

      let latitude = point.location._lat;
      let longitude = point.location._long;
      
      return new Feature({
        geometry: new Point(fromLonLat([
          longitude, latitude
        ]))
      });
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features: pts }),
      style: style
    });

    return vectorLayer;
  }

  componentDidMount(){

    this.getData(data => {

      var raster = new TileLayer({
        source: new OSMSource()
      });
      
      var map = new Map({
        layers: [ raster, this.getPointsLayer(data) ],
        target: 'map',
        view: new View({
          center: fromLonLat([ -110, 46 ]),
          zoom: 4,
          maxZoom: 10 // TODO: Change
        })
      });

      console.log(map.getLayers());
    })
  }

  render(){
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh'
    };
    const mapStyle = {
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#cccccc'
    };
    const controlsStyle = {
      flexGrow: 0,
      width:'100%'
    };
    return (
      <div style={containerStyle}>
        <div id='map' style={mapStyle}></div>
        <div style={controlsStyle}>
          Temp
        </div>
      </div>
    )
  }
}
export default OLMap;
