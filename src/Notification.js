import React from 'react';
import { Container, Paper, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import './Notification.css';

class Notification extends React.Component {
  
  render() {
    return (
      <Paper className={'notification ' + this.props.severity} elevation={3}>
        <Container maxWidth='xs'>
          <Typography component='div'>
            <h4>{this.props.title}</h4>
            <p>{this.props.body}</p>
            <IconButton className='closeIcon' onClick={() => this.props.closeFunc(this.props._id)}>
              <CloseIcon />
            </IconButton>
          </Typography>
        </Container>
      </Paper>
    )
  }
}

export default Notification;
