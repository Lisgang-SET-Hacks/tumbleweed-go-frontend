import React from 'react';
import axios from 'axios';
import { Container, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';

import OLMap from './OLMap';
import Info from './Info';
import Timeline from './Timeline';
import AppBar from './AppBar';
import Notification from './Notification';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import fbConfig from './util/firebase-credentials.json';

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
    refreshTumbleweedDataSnackbarIsOpen: false,
    removeTumbleweedDialogIsOpen: false,
    loginDialogIsOpen: false,
    notifications: [],
    deleteTumbleweedFlag: 0,

    loggedIn: false,
    formData: {},
    formError: {}
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
      this.addNotification(null, 'Tumbleweed movement predictions reset! Refresh the page to see the updates.', 'info', 0);
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

  openRemoveTumbleweedDialog = () => this.setState({ removeTumbleweedDialogIsOpen: true });
  openLoginDialog = () => this.setState({ loginDialogIsOpen: true });

  handleTumbleweedDialogClose = (response) => {
    this.setState({ removeTumbleweedDialogIsOpen: false });
    if (response) {
      this.removeTumbleweed((status) => {
        if (status === 200) {
          this.addNotification('Success', 'Tumbleweed has been removed.', 'success', 5000);
          this.setState({ deleteTumbleweedFlag: Date.now() });
        }
        else {
          this.addNotification('Error', 'There was an error removing the tumbleweed.', 'error', 5000);
        }
      });
    }
  }

  handleLoginDialogClose = (response) => {
    // form validation
    let validationResult = this.validateLoginForm();
    let formErrorCopy = {...this.state.formError};

    formErrorCopy.email = validationResult.email.ok ? null : validationResult.email.message;
    formErrorCopy.password = validationResult.password.ok ? null : validationResult.password.message;

    this.setState({ formError: formErrorCopy });

    // cancel login
    if (!response){
      this.setState({ loginDialogIsOpen: false });
      return;
    }

    // Log in
    if (validationResult.email.ok && validationResult.password.ok){
      firebase.auth().signInWithEmailAndPassword(this.state.formData.email, this.state.formData.password)
        .then(result => {
          this.setState({
            loginError: null,
            loginDialogIsOpen: false,
            loggedIn: true
          });
          this.addNotification('Success', 'Logged in', 'success', 3000);
        })
        .catch(err => {
          this.setState({ loginError: 'Login unsuccessful.' })
        });
    }
  }

  logout = () => {
    firebase.auth().signOut()
      .then(() => {
        this.addNotification('Success', 'Logged out', 'success', 3000);
      }).catch(function(error) {
        this.addNotification('Error', 'There was an error logging out.', 'error');
      });
  }

  handleFormDataChange = (e) => {
    let formDataCopy = {...this.state.formData};
    formDataCopy[e.target.getAttribute('name')] = e.target.value;
    this.setState({ formData: formDataCopy });
  }

  validateLoginForm = () => {
    let result = {
      email: { ok: true },
      password: { ok: true }
    };

    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexp.test(this.state.formData.email)){
      result.email.ok = false;
      result.email.message = 'Invalid email address.';
    }

    if (!this.state.formData.password || this.state.formData.password.length === 0){
      result.password.ok = false;
      result.password.message = 'Password cannot be empty';
    }

    return result;
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

  addNotification = (title, body, severity, duration) => {

    let newNotificationId = `${Date.now()}_${Math.random()}`
    let obj = {
      id: newNotificationId,
      title: title,
      body: body,
      severity: severity
    };

    if (duration !== 0) {
      setTimeout(() => {
        this.removeNotification(newNotificationId);
      }, duration);
    }

    this.setState(state => ({
      notifications: [ ...state.notifications, obj ]
    }));
  }

  removeNotification = (id) => {
    this.setState(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  }

  componentDidMount() {
    this.initData();

    firebase.initializeApp(fbConfig);

    // check if user is signed in
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loggedIn: Boolean(user) })
    });
  }

  render() {
    return (
      <>
        <div className='appContainer'>
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
              removeTumbleweedFunc={this.openRemoveTumbleweedDialog}
              loggedIn={this.state.loggedIn}
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
              openLoginDialogFunc={this.openLoginDialog}
              logoutFunc={this.logout}
              loggedIn={this.state.loggedIn}
            />
          </div>
        </div>

        <Dialog maxWidth='sm' open={this.state.removeTumbleweedDialogIsOpen}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Are you sure you would like to remove this tumbleweed?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => this.handleTumbleweedDialogClose(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.handleTumbleweedDialogClose(true)} color='primary'>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog maxWidth='sm' fullWidth open={this.state.loginDialogIsOpen}>
          <DialogTitle>Log in</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label='Email'
              type='email'
              name='email'
              error={this.state.formError.email}
              helperText={this.state.formError.email}
              onChange={this.handleFormDataChange}
            /><br /><br />
            <TextField
              required
              fullWidth
              label='Password'
              type='password'
              name='password'
              error={this.state.formError.password}
              helperText={this.state.formError.password}
              onChange={this.handleFormDataChange}
            />
            <Typography>{this.state.loginError}</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => this.handleLoginDialogClose(false)} color='primary'>
              Cancel
            </Button>
            <Button onClick={() => this.handleLoginDialogClose(true)} color='primary'>
              Log in
            </Button>
          </DialogActions>
        </Dialog>

        <div id='notification-container'>
          {
            this.state.notifications.map(n => {
              return <Notification
                key={n.id}
                _id={n.id}
                title={n.title}
                body={n.body}
                severity={n.severity}
                closeFunc={this.removeNotification}
              />
            })
          }
        </div>
      </>
    );
  }
}

export default App;
