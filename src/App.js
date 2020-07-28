import React from 'react';
import axios from 'axios';
import { Container, Snackbar, IconButton, Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import OLMap from './OLMap';
import Info from './Info';
import Timeline from './Timeline';
import AppBar from './AppBar';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import './App.css';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    refreshTumbleweedDataSnackbarIsOpen: false,
    removeTumbleweedDialogIsOpen: false,
    notifications: [],
    deleteTumbleweedFlag: 0
  };

  refreshTumbleweedData = () => {

    this.setState({
      refreshPredictionsDisabled: true,
      refreshTumbleweedDataSnackbarIsOpen: false
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
        refreshTumbleweedDataSnackbarIsOpen: true
      });
    }).catch(err => {
      console.log('big rip ' + err);
    });
  }

  closeRefreshTumbleweedDataSnackbar = () => {
    this.setState({ refreshTumbleweedDataSnackbarIsOpen: false });
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

  openDialog = () => this.setState({ removeTumbleweedDialogIsOpen: true });

  handleDialogClose = (response) => {
    this.setState({ removeTumbleweedDialogIsOpen: false });
    if (response) {
      this.removeTumbleweed((status) => {
        if (status === 200) {
          this.addNotification('Success', 'Tumbleweed has been removed.', 'success');
          this.setState({ deleteTumbleweedFlag: Date.now() });
        }
        else {
          this.addNotification('Error', 'There was an error removing the tumbleweed.', 'error');
        }
      });
    }
  }

  removeTumbleweed = (cb) => {
    let url = 'https://tumbleweed-go-284013.ue.r.appspot.com/tumbleweed/delete';
    let tumbleweedIndex = this.state.selectedTumbleweedData.tumbleweedIndex;
    let formData = new FormData();
    formData.append('id', this.state.tumbleweedData[tumbleweedIndex]._id);
    axios({
      method: 'post',
      url: url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      if (res.status && res.status === 200) {
        cb(res.status);
      }
      else {
        console.log('rip ' + res.status);
        cb(res.status);
      }
    }).catch(err => {
      console.log('big rip ' + err);
      cb(500);
    });
  }

  initData = () => {
    this.getData(data => {
      this.setState({ tumbleweedData: data });
    });
  }

  getNextNotificationId = () => {
    let nextId = -1;
    this.state.notifications.forEach(n => {
      if (n.id > nextId) nextId = n.id;
    });

    return nextId;
  }

  addNotification = (title, body, severity) => {
    let notificationsCopy = this.state.notifications.slice();
    let newNotificationId = this.getNextNotificationId();
    notificationsCopy.push({
      id: newNotificationId,
      title: title,
      body: body,
      severity: severity
    });

    setTimeout(() => {
      this.removeNotification(newNotificationId);
    }, 5000);

    this.setState({ notifications: notificationsCopy });
  }

  removeNotification = (id) => {
    let notificationsCopy = this.state.notifications.slice();
    let index = -1;
    for (let i = 0; i < notificationsCopy.length; i++){
      if (notificationsCopy[i].id === id){
        index = i;
        break;
      }
    }

    if (index !== -1){
      notificationsCopy.splice(index, 1);
      this.setState({ notifications: notificationsCopy });
    }
  }

  componentDidMount() {
    this.initData();
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
              deleteTumbleweedFlag={this.state.deleteTumbleweedFlag}
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
          open={this.state.refreshTumbleweedDataSnackbarIsOpen}
          message='Tumbleweed movement predictions reset! Refresh the page to see the updates.'
          action={
            <IconButton size='small' aria-label='close' color='inherit' onClick={this.closeRefreshTumbleweedDataSnackbar}>
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        />

        <Dialog maxWidth='sm' open={this.state.removeTumbleweedDialogIsOpen}>
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

        {
          this.state.notifications.map(n => {
            return (
            <Snackbar key={n.id} open={true} onClose={() => this.removeNotification(n.id)}>
              <Alert onClose={() => this.removeNotification(n.id)} severity={n.severity}>
                <AlertTitle>{n.title}</AlertTitle>
                {n.body}
              </Alert>
            </Snackbar>
          )})
        }
      </>
    );
  }
}

export default App;
