import React from 'react';
import Slider from '@material-ui/core/Slider';
import OLMap from './OLMap';

import './App.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

    let label = new Date().getDay() + 1;
    for (let i = 2; i < this.state.sliderRange; i++) {
      sliderMarks.push({
        value: i,
        label: daysOfWeek[label % 7]
      });
      label++;
    }

    this.setState({ sliderMarks: sliderMarks });
  }

  componentDidMount() {
    this.setSliderMarks();
  }

  render() {
    return (
      <div className='container'>
        <OLMap day={this.state.day} sliderRange={this.state.sliderRange} />
        <div className='controls'>
          <h3 style={{ marginTop: 0 }}>View movement predictions (USA only):</h3>
          <Slider
            id='slider'
            className='controls__slider'
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
