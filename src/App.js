import React from 'react';
import axios from 'axios';
import { Container, Snackbar, IconButton, Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OLMap from './OLMap';
import Info from './Info';
import Timeline from './Timeline';
import AppBar from './AppBar';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import './App.css';

class App extends React.Component {

  state = {
    day: 0,
    sliderMarks: [],
    sliderRange: 8,  // 7 days in advance
    tumbleweedData: [],
    selectedTumbleweedData: {
      tumbleweedIndex: -1,
      predictionIndex: -1
    },
    refreshPredictionsDisabled: false,
    refreshTumbleweedDataSnackbarOpen: false,
    dialogIsOpen: false
  };

  refreshTumbleweedData = () => {

    this.setState({
      refreshPredictionsDisabled: true,
      refreshTumbleweedDataSnackbarOpen: false
    });
    
    let url = 'https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/update';
    let formData = new FormData();
    formData.append('forced', 'true');
    axios({
      method: 'post',
      url: url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {
      this.setState({
        refreshPredictionsDisabled: false,
        refreshTumbleweedDataSnackbarOpen: true
      });
    }).catch(err => {
      console.log('big rip ' + err);
    });
  }

  closeRefreshTumbleweedDataSnackbar = () => {
    this.setState({ refreshTumbleweedDataSnackbarOpen: false });
  }

  getData = (cb) => {
    let url = 'https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/get';
    axios.get(url).then(res => {
      if (res.status && res.status === 200) {
        cb(res.data.result);
      }
      else {
        console.log('rip ' + res.status);
      }
    }).catch(err => {
      console.log('big rip ' + err);
    });
  }

  getSelectedTumbleweedData = () => {
    let index = this.state.selectedTumbleweedData.tumbleweedIndex;
    return index === -1 ? null : this.state.tumbleweedData[index];
  }

  onTimelineChange = (e, val) => {
    this.setState({ day: val });
    this.updateSelectedTumbleweedData(this.state.selectedTumbleweedData.tumbleweedIndex, val - 1);
  }

  updateSelectedTumbleweedData = (tumbleweedIndex, predictionIndex) => {
    this.setState({
      selectedTumbleweedData: {
        tumbleweedIndex: tumbleweedIndex,
        predictionIndex: predictionIndex
      }
    });
  }

  openDialog = () => this.setState({ dialogIsOpen: true });

  handleDialogClose = (response) => {
    this.setState({ dialogIsOpen: false });
    if (response) this.removeTumbleweed((status) => {
      if (status === 200){
        console.log('successfully removed tumbleweed');
      
        // refresh
        this.getData(data => this.setState({ tumbleweedData: data }));
      }
    });
  }

  removeTumbleweed = (cb) => {
    console.log('removing tumbleweed')
    let url = 'https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/delete';
    let tumbleweedIndex = this.state.selectedTumbleweedData.tumbleweedIndex;
    axios.post(url, {
      id: this.state.tumbleweedData[tumbleweedIndex]._id
    }).then(res => {
      if (res.status && res.status === 200){
        cb(res.status);
      }
      else {
        console.log('rip ' + res.status);
        cb(res.status)
      }
    }).catch(err => {
      console.log('big rip ' + err);
    });
  }

  componentDidMount() {
    this.getData(data => {
      this.setState({ tumbleweedData: data });
    });
  }

  render() {
    return (
      <>
        <div className='container'>
          <div className='map__wrapper'>
            <OLMap
              data={this.state.tumbleweedData}
              day={this.state.day}
              sliderRange={this.state.sliderRange}
              selectedTumbleweedIndex={this.state.selectedTumbleweedData.tumbleweedIndex}
              updateSelectedTumbleweedDataFunc={this.updateSelectedTumbleweedData}
            />
          </div>
          <Container maxWidth={false} className='info'>
            <Info
              data={this.getSelectedTumbleweedData()}
              predictionIndex={this.state.selectedTumbleweedData.predictionIndex}
              removeTumbleweedFunc={this.openDialog}
            />
          </Container>
          <Container maxWidth={false} className='timeline'>
            <Timeline
              sliderRange={this.state.sliderRange}
              onTimelineChangeFunc={this.onTimelineChange}
            />
          </Container>
          <div className='topBar'>
            <AppBar
              refreshPredictionsDisabled={this.state.refreshPredictionsDisabled}
              refreshTumbleweedDataFunc={this.refreshTumbleweedData}
            />
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.refreshTumbleweedDataSnackbarOpen}
          message='Tumbleweed movement predictions reset! Refresh the page to see the updates.'
          action={
            <IconButton size='small' aria-label='close' color='inherit' onClick={this.closeRefreshTumbleweedDataSnackbar}>
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        />

        <Dialog className='dialog' fullWidth maxWidth='sm' open={this.state.dialogIsOpen}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Are you sure you would like to remove this tumbleweed?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => this.handleDialogClose(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.handleDialogClose(true)} color='primary'>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default App;
