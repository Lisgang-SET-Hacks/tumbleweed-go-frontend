import React from 'react';
import { Typography, Slider } from '@material-ui/core';

import { formatDateAsString } from './util/funcs';

class Timeline extends React.Component {

  state = {
    sliderMarks: []
  }

  setSliderMarks = () => {

    let sliderMarks = [
      { value: 0, label: <b>Today</b> },
      { value: 1, label: 'Tomorrow' }
    ];
    
    let millisToDay = 1000 * 60 * 60 * 24;
    for (let i = 2; i < this.props.sliderRange; i++) {
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
      <Typography component='div' align='center'>
        <h4>Movement predictions (USA only)</h4>
        <p>
          <Slider
            className='timeline__slider'
            onChange={this.props.onTimelineChangeFunc}
            min={0}
            max={this.props.sliderRange - 1}
            marks={this.state.sliderMarks}
          />
        </p>
      </Typography>
    );
  }
}

export default Timeline;
