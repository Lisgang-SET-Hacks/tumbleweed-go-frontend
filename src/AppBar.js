import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

import logo_textWhite from './images/logo/text_white.svg';

class CustomAppBar extends React.Component {

  render() {

    return (
      <AppBar position='static'>
        <Toolbar style={{paddingLeft: 0}}>  {/* No padding left to accomodate logo positioning. */}
          <Typography variant='h5' style={{flexGrow: 1}}>
            <div style={{ width: 400, textAlign: 'center' }}>
              <img src={logo_textWhite} style={{height: '1.2em', paddingTop: '0.2em', imageRendering: 'crisp-edges'}} draggable={false} alt='Logo' />
            </div>
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
          <Button
            className={this.props.loggedIn ? 'hidden' : null}
            variant='contained'
            color='primary'
            disableElevation
            onClick={this.props.openLoginDialogFunc}
          >
            Log in
          </Button>
          <Button
            className={this.props.loggedIn ? null : 'hidden'}
            variant='contained'
            color='primary'
            disableElevation
            onClick={this.props.logoutFunc}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default CustomAppBar;
