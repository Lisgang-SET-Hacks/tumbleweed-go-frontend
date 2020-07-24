import React from 'react';

import { Map, Feature, View, Overlay } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, BingMaps } from 'ol/source';
import { Circle, Fill, Stroke, Style } from 'ol/style';

import { formatAsCoordinate } from './util/funcs';

import 'ol/ol.css';

class OLMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tumbleweedLayers: [],
      currentTumbleweedLayer: null,
      tumbleweedTrailLayers: [],
      currentTumbleweedTrailLayer: null
    }
    this.map = null;
    this.popupOverlay = null;
    this.mapRef = React.createRef();
    this.popupRef = React.createRef();
  }

  initWithData = (data) => {
    let tumbleweedLayers = [];
    let tumbleweedTrailLayers = [];
    for (let i = 0; i < this.props.sliderRange; i++) {
      tumbleweedLayers.push(this.setTumbleweedLayer(data, i - 1));
      tumbleweedTrailLayers.push(this.setTumbleweedTrailLayer(data, i - 1));
    }
    this.setState({
      tumbleweedLayers: tumbleweedLayers,
      currentTumbleweedLayer: tumbleweedLayers[0],
      tumbleweedTrailLayers: tumbleweedTrailLayers,
      currentTumbleweedTrailLayer: tumbleweedTrailLayers[0]
    }, () => {
      this.initMap();
    });
  }

  setTumbleweedLayer = (data, index) => {

    let currentTumbleweedStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: '#e3af2b' }),
        stroke: new Stroke({ color: '#664e13', width: 2 })
      })
    });

    let pastTumbleweedStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: '#e2cf9e' }),
        stroke: new Stroke({ color: '#664e13', width: 2 })
      })
    });

    // Draw tumbleweeds.

    let features = data.map((point, i) => {

      let style = currentTumbleweedStyle;

      let id, longitude, latitude;
      
      if (index === -1) {
        id = `tumbleweed_${i}`;
        latitude = point.location._lat;
        longitude = point.location._long;
      }
      else if (point.predictedLocations.length === 0) {
        id = `tumbleweed_${i}`;
        latitude = point.location._lat;
        longitude = point.location._long;
        style = pastTumbleweedStyle;
      }
      else if (index < point.predictedLocations.length) {
        id = `tumbleweed_${i}_${index}`;
        latitude = point.predictedLocations[index]._lat;
        longitude = point.predictedLocations[index]._long;
      }
      else {
        let n = point.predictedLocations.length - 1;
        id = `tumbleweed_${i}_${n}`;
        latitude = point.predictedLocations[n]._lat;
        longitude = point.predictedLocations[n]._long;
        style = pastTumbleweedStyle;
      }

      let feature = new Feature({
        geometry: new Point(fromLonLat([
          longitude, latitude
        ]))
      });
      feature.setId(id);
      feature.setStyle(style);
      return feature;
    });

    let layer = new VectorLayer({
      source: new VectorSource({ features: features })
    });
    layer.set('name', 'tumbleweeds');
    return layer;
  }

  setTumbleweedTrailLayer = (data, index) => {

    let trailStyle = new Style({
      stroke: new Stroke({ color: '#664e13', width: 4 })
    });

    // Draw trail.

    let features = [];

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
            feature.setStyle(trailStyle);
            features.push(feature);
          }
        });
      }
    }

    let layer = new VectorLayer({
      source: new VectorSource({ features: features })
    });
    layer.set('name', 'tumbleweedTrails');
    return layer;
  }

  initMap = () => {

    let mapLayer = new TileLayer({
      className: 'map__bingMaps',
      source: new BingMaps({
        key: 'AtMr0RAC0iKdKPPPsGSPqIFCxjk7XpR9rq99IQR5vDBoax8u1KuYvOinwtsiQcFI',
        imagerySet: 'AerialWithLabelsOnDemand'
      })
    });

    this.popupOverlay = new Overlay({
      element: this.popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [ 0, -16 ]
    });
    
    this.map = new Map({
      layers: [ mapLayer, this.state.currentTumbleweedTrailLayer, this.state.currentTumbleweedLayer ],
      overlays: [ this.popupOverlay ],
      target: this.mapRef.current,
      view: new View({
        center: fromLonLat([ -97, 42 ]),
        zoom: 5,
        minZoom: 5,
        maxZoom: 15
      })
    });

    this.map.on('click', e => {
      // Default to no selection.
      this.deselectTumbleweed();
      this.hidePopup();
      // Select if applicable.
      this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (layer.get('name') === 'tumbleweeds') {
          this.selectTumbleweed(feature);
          this.showPopup(feature);
          return true;
        }
      });
    });

    this.map.on('pointermove', e => {
      // Default to no selection.
      this.map.getTarget().style.cursor = '';
      // Select if applicable.
      this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        if (layer.get('name') === 'tumbleweeds') {
          this.map.getTarget().style.cursor = 'pointer';
          return true;
        }
      });
    });
  }

  selectTumbleweed = (feature) => {
    let [ tumbleweedId, predictedLocationId ] = String(feature.getId()).split('_').splice(1);  // Ignore the first element.
    if (predictedLocationId !== undefined) {
      this.props.updateSelectedTumbleweedDataFunc(tumbleweedId, predictedLocationId);
    }
    else {
      this.props.updateSelectedTumbleweedDataFunc(tumbleweedId, -1);
    }
  }

  deselectTumbleweed = () => {
    this.props.updateSelectedTumbleweedDataFunc(-1, -1);
  }

  showPopup = (feature) => {
    let coordRaw = feature.getGeometry().getCoordinates();
    let coordLonLat = transform(coordRaw, 'EPSG:3857', 'EPSG:4326');
    
    this.popupRef.current.innerHTML = formatAsCoordinate(coordLonLat[1], coordLonLat[0], 3);
    this.popupRef.current.style.display = 'block';
    this.popupOverlay.setPosition(coordRaw);
  }

  hidePopup = () => {
    this.popupRef.current.style.display = 'none';
  }

  refreshPopup = () => {
    if (this.props.selectedTumbleweedIndex !== -1) {
      let features = this.state.currentTumbleweedLayer.getSource().getFeatures();
      this.showPopup(features[this.props.selectedTumbleweedIndex]);
    }
  }

  showTumbleweedLayer = (index, callback = (() => {})) => {
    this.map.removeLayer(this.state.currentTumbleweedTrailLayer);
    this.map.removeLayer(this.state.currentTumbleweedLayer);
    this.map.addLayer(this.state.tumbleweedTrailLayers[index]);
    this.map.addLayer(this.state.tumbleweedLayers[index]);
    this.setState({
      currentTumbleweedLayer: this.state.tumbleweedLayers[index],
      currentTumbleweedTrailLayer: this.state.tumbleweedTrailLayers[index]
    }, () => callback());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.initWithData(this.props.data);
    }
    if (prevProps.day !== this.props.day) {
      this.showTumbleweedLayer(this.props.day, () => {
        this.refreshPopup();
      });
    }
  }

  render(){
    return (
      <div ref={this.mapRef} className='map'>
        <div ref={this.popupRef} className='map__popup' style={{display: 'none'}} />
      </div>
    )
  }
}
export default OLMap;
