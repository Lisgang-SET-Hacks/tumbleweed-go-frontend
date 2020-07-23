import React from 'react';
import { Divider } from '@material-ui/core';

class Info extends React.Component {

  render() {

    return (
      <div>
        <h2>Tumbleweed Info</h2>
        <Divider />
        <h4>Current position (est.)</h4>
        <p>(46, -110)</p>
        <Divider />
        <h4>Initial sighting time</h4>
        <p>
          {(new Date()).toLocaleDateString()}
          <br />
          {(new Date()).toLocaleTimeString()}
        </p>
        <h4>Initial sighting position</h4>
        <p>(46, -110)</p>
        <h4>Initial sighting image</h4>
        <div className='aspect-ratio' style={{paddingBottom: '75%'}}>
          <div>
            <img src='https://picsum.photos/400' alt='Initial sighting' />
          </div>
        </div>
      </div>
    );
  }
}

export default Info;
