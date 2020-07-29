import React from 'react';
import { Typography, Divider, Card, CardActionArea, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { formatAsCoordinate } from './util/funcs';

class Info extends React.Component {

  render = ()  => {

    let { data, predictionIndex } = this.props;

    if (!data) {
      return (
        <Typography component='div' align='center'>
          <h4>No tumbleweed selected.</h4>
        </Typography>
      );
    }

    let currentLocation = data.location;
    if (data.predictedLocations.length > 0) {
      if (predictionIndex !== -1) {
        let index = Math.min(predictionIndex, data.predictedLocations.length - 1);
        currentLocation = data.predictedLocations[index];
      }
    }

    return (
      <Typography component='div' align='center'>
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
        <Card className='aspect-ratio' variant='outlined' style={{paddingBottom: '75%', marginBottom: '1em'}}>
          <div>
            <CardActionArea onClick={() => alert('test')}>
            <img src='https://picsum.photos/400' alt='Initial sighting' />
            </CardActionArea>
          </div>
        </Card>
        <Button
          startIcon={<DeleteIcon />}
          className={this.props.accessToken ? null : 'hidden'}
          variant='contained'
          color='primary'
          disableElevation
          onClick={this.props.removeTumbleweedFunc}
        >
          Remove this tumbleweed
        </Button>
      </Typography>
    );
  }
}

export default Info;
