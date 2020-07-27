import React from 'react';
import { Divider } from '@material-ui/core';

import { formatAsCoordinate } from './util/funcs';

class Info extends React.Component {

  renderInfo = ()  => {

    let { data, predictionIndex } = this.props;

    if (!data) {
      return <p>No tumbleweed selected.</p>;
    }

    let currentLocation = data.location;
    if (data.predictedLocations.length > 0) {
      if (predictionIndex !== -1) {
        let index = Math.min(predictionIndex, data.predictedLocations.length - 1);
        currentLocation = data.predictedLocations[index];
      }
    }

    return (
      <>
        <h4>Current position (est.)</h4>
        <p dangerouslySetInnerHTML={{
          __html: formatAsCoordinate(currentLocation._latitude, currentLocation._longitude)
        }} />
        <Divider />
        <h4>Initial sighting time</h4>
        <p>
          {(new Date(data.uploadTime)).toLocaleDateString()}
          <br />
          {(new Date(data.uploadTime)).toLocaleTimeString()}
        </p>
        <h4>Initial sighting position</h4>
        <p dangerouslySetInnerHTML={{
          __html: formatAsCoordinate(data.uploadLocation._latitude, data.uploadLocation._longitude)
        }} />
        <h4>Initial sighting image</h4>
        <div className='aspect-ratio' style={{paddingBottom: '75%'}}>
          <div>
            <img src='https://picsum.photos/400' alt='Initial sighting' />
          </div>
        </div>
      </>
    );
  }

  render() {

    return (
      <div>
        <h2>Tumbleweed Info</h2>
        <Divider />
        {this.renderInfo()}
      </div>
    );
  }
}

export default Info;
