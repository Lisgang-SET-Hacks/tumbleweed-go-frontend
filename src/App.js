import React from 'react';
import { Container, Slider } from '@material-ui/core';
import OLMap from './OLMap';
import Info from './Info';

import { formatDateAsString } from './util/funcs';

import './App.css';

class App extends React.Component {

  state = {
    day: 0,
    sliderMarks: [],
    sliderRange: 8,  // 7 days in advance
    tumbleweed: {}
  };

  setSliderMarks = () => {

    let sliderMarks = [
      { value: 0, label: <b>Today</b> },
      { value: 1, label: 'Tomorrow' }
    ];
    
    let millisToDay = 1000 * 60 * 60 * 24;
    for (let i = 2; i < this.state.sliderRange; i++) {
      let date = new Date(Date.now() + millisToDay * i);
      sliderMarks.push({
        value: i,
        label: formatDateAsString(date)
      });
    }

    this.setState({ sliderMarks: sliderMarks });
  }

  updateInfoPanel = (tumbleweedData, predictedLocationIndex) => {
    if (!tumbleweedData){
      this.setState({ selectedTumbleweed: null });
      return;
    }
    let tumbleweed = {
      initial: {
        location: {
          _lat: tumbleweedData.uploadLocation._lat,
          _long: tumbleweedData.uploadLocation._long,
        },
        time: tumbleweedData.uploadTime,
        img: null
      }
    };

    if (predictedLocationIndex){
      tumbleweed.location = {
        _lat: tumbleweedData.predictedLocations[predictedLocationIndex]._lat,
        _long: tumbleweedData.predictedLocations[predictedLocationIndex]._long
      }
    }
    else {
      tumbleweed.location = {
        _lat: tumbleweedData.location._lat,
        _long: tumbleweedData.location._long
      }
    }
    
    this.setState({ selectedTumbleweed: tumbleweed })
  }

  componentDidMount() {
    this.setSliderMarks();
  }

  render() {
    return (
      <div className='container'>
        <div className='map__wrapper'>
          <OLMap day={this.state.day} sliderRange={this.state.sliderRange} selectTumbleweedFunc={this.updateInfoPanel} />
        </div>
        <Container className='info'>
          <Info tumbleweed={this.state.selectedTumbleweed} />
        </Container>
        <div className='timeline'>
          <h4 style={{ marginTop: 0 }}>Movement predictions (USA only)</h4>
          <Slider
            className='timeline__slider'
            onChange={ (e, val) => this.setState({ day: val }) }
            min={0}
            max={this.state.sliderRange - 1}
            marks={this.state.sliderMarks}
          />
        </div>
      </div>
    );
  }
}

export default App;
