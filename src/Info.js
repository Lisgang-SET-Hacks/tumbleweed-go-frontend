import React from 'react';
import { Divider } from '@material-ui/core';

class Info extends React.Component {

  render() {

    if (this.props.tumbleweed){
      return (
        <div>
          <h2>Tumbleweed Info</h2>
          <Divider />
          <h4>Current position (est.)</h4>
          <p>({this.props.tumbleweed.location._lat + ',' + this.props.tumbleweed.location._long})</p>
          <Divider />
          <h4>Initial sighting time</h4>
          <p>
            {(new Date(this.props.tumbleweed.initial.time)).toLocaleDateString()}
            <br />
            {(new Date(this.props.tumbleweed.initial.time)).toLocaleTimeString()}
          </p>
          <h4>Initial sighting position</h4>
          <p>({this.props.tumbleweed.initial.location._lat + ',' + this.props.tumbleweed.initial.location._long})</p>
          <h4>Initial sighting image</h4>
          <div className='aspect-ratio' style={{paddingBottom: '75%'}}>
            <div>
              <img src='https://picsum.photos/400' alt='Initial sighting' />
            </div>
          </div>
        </div>
      );
    }
    else return <div>There is no tumbleweed</div>
  }
}

export default Info;
