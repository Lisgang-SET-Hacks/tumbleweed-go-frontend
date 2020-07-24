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
    sliderRange: 8  // 7 days in advance
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

  componentDidMount() {
    this.setSliderMarks();
  }

  render() {
    return (
      <div className='container'>
        <div className='map__wrapper'>
          <OLMap day={this.state.day} sliderRange={this.state.sliderRange} />
        </div>
        <Container className='info'>
          <Info />
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
