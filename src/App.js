import React from 'react';
import Slider from '@material-ui/core/Slider';
import OLMap from './OLMap';

import './App.css';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class App extends React.Component {

  state = {
    day: 0,
    sliderMarks: []
  };

  setSliderMarks = () => {

    let sliderMarks = [
      { value: 0, label: <b>Today</b> },
      { value: 1, label: 'Tomorrow' }
    ];

    let label = new Date().getDay() + 1;
    for (let i = 2; i < 7; i++){
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
        <OLMap day={this.state.day} />
        <div className='controls'>
          <h3 style={{ marginTop: 0 }}>Select day to view:</h3>
          <Slider
            id='slider'
            className='controls__slider'
            onChange={ (e, val) => this.setState({ day: val }) }
            min={0}
            max={6}
            marks={this.state.sliderMarks}
          />
        </div>
      </div>
    );
  }
}

export default App;
