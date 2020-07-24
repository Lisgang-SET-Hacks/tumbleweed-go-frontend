import React from 'react';
import axios from 'axios';
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
    tumbleweedData: [],
    selectedTumbleweedData: {
      tumbleweedIndex: -1,
      predictionIndex: -1
    }
  };

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

  getSelectedTumbleweedData = () => {
    let index = this.state.selectedTumbleweedData.tumbleweedIndex;
    return index === -1 ? null : this.state.tumbleweedData[index];
  }

  onTimelineChange = (e, val) => {
    this.setState({ day: val });
    this.updateSelectedTumbleweedData(this.state.selectedTumbleweedData.tumbleweedIndex, val - 1);
  }

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

  updateSelectedTumbleweedData = (tumbleweedIndex, predictionIndex) => {
    this.setState({
      selectedTumbleweedData: {
        tumbleweedIndex: tumbleweedIndex,
        predictionIndex: predictionIndex
      }
    });
  }

  componentDidMount() {
    this.setSliderMarks();
    this.getData(data => {
      this.setState({ tumbleweedData: data });
    });
  }

  render() {
    return (
      <div className='container'>
        <div className='map__wrapper'>
          <OLMap
            data={this.state.tumbleweedData}
            day={this.state.day}
            sliderRange={this.state.sliderRange}
            selectedTumbleweedIndex={this.state.selectedTumbleweedData.tumbleweedIndex}
            updateSelectedTumbleweedDataFunc={this.updateSelectedTumbleweedData}
          />
        </div>
        <Container className='info'>
          <Info
            data={this.getSelectedTumbleweedData()}
            predictionIndex={this.state.selectedTumbleweedData.predictionIndex}
          />
        </Container>
        <div className='timeline'>
          <h4 style={{ marginTop: 0 }}>Movement predictions (USA only)</h4>
          <Slider
            className='timeline__slider'
            onChange={this.onTimelineChange}
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
