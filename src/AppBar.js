import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

class CustomAppBar extends React.Component {

  render() {

    return (
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' style={{flexGrow: 1}}>
            <div className='rowdies' style={{ width: 'calc(400px - 2 * 24px)', textAlign: 'center' }}>Tumbleweed GO</div>
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            variant='contained'
            color='primary'
            disableElevation
            disabled={this.props.refreshPredictionsDisabled}
            onClick={this.props.refreshTumbleweedDataFunc}
          >
            Reset Predictions
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default CustomAppBar;
