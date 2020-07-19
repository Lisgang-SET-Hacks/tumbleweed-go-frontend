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

  getPointsLayer = (data) => {

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

      let latitude = point.location._lat;
      let longitude = point.location._long;
      
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

  componentDidMount(){
    this.getData(data => {

      let raster = new TileLayer({
        source: new OSMSource()
      });
      
      let map = new Map({
        layers: [ raster, this.getPointsLayer(data) ],
        target: this.mapRef.current,
        view: new View({
          center: fromLonLat([ -110, 46 ]),
          zoom: 4,
          minZoom: 4,
          maxZoom: 11 // TODO: Change
        })
      });
    })
  }

  render(){
    return (
      <div ref={this.mapRef} className='map' />
    )
  }
}
export default OLMap;
