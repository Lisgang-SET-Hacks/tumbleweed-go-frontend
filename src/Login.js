import React from 'react';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import * as fb from './util/firebase';

class Login extends React.Component {

  state = {
    open: false,
    showErrorMsg: false,
    errorMsg: ''
  }

  form = { email: '', password: '' }

  showErrorMsg = (msg) => this.setState({ showErrorMsg: true, errorMsg: msg });
  hideErrorMsg = ()    => this.setState({ showErrorMsg: false });

  open  = () =>  this.setState({ open: true, showErrorMsg: false });  // No need to clear input fields -> they are automatically cleared with the defaultValue prop.
  close = () => this.setState({ open: false });

  handleFormChange = (e) => {
    let name = e.target.getAttribute('name');
    this.form[name] = e.target.value;
  }

  login = () => {

    let { email, password } = this.form;

    if (!email || !password) {
      this.showErrorMsg('All fields are required.');
      return;
    }

    fb.auth.signInWithEmailAndPassword(email, password).then(res => {
      // Login success.
      let token = res.user.xa;
      this.props.setAccessTokenFunc(token);
      this.props.addNotificationFunc('Success', 'Log in successful.', 'success', 3000);
      this.close();
    }).catch(err => {
      // Login fail.
      if (err.code === 'auth/invalid-email') {
        this.showErrorMsg('Invalid email.');
      }
      else if (err.code === 'auth/user-disabled') {
        this.showErrorMsg('The account has been disabled by an administrator.');
      }
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        this.showErrorMsg('Invalid credentials.');
      }
      else {
        console.log(err);
        this.showErrorMsg('An unexpected error occurred.');
      }
    });
  }

  logout = () => {
    fb.auth.signOut().then(() => {
      this.props.addNotificationFunc('Success', 'Log out successful.', 'success', 3000);
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    // Check if user is signed in.
    fb.auth.onAuthStateChanged(user => {
      if (user) {
        let token = user.xa;
        this.props.setAccessTokenFunc(token);
      }
      else {
        this.props.setAccessTokenFunc(null);
      }
    });
  }

  render() {
    return (
      <>
        <Button
          className={this.props.accessToken ? 'hidden' : null}
          startIcon={<AccountCircleIcon />}
          variant='contained'
          color='primary'
          disableElevation
          onClick={this.open}
        >
          Log in
        </Button>
        <Button
          className={this.props.accessToken ? null : 'hidden'}
          startIcon={<AccountCircleIcon />}
          variant='contained'
          color='primary'
          disableElevation
          onClick={this.logout}
        >
          Log out
        </Button>
        <Dialog maxWidth='sm' open={this.state.open}>
          <DialogTitle>Log in (test)</DialogTitle>
          <DialogContent>
            <TextField
              type='email'
              fullWidth
              label='Email' name='email'
              onChange={this.handleFormChange}
              defaultValue=''
              autoFocus
            />
            <TextField
              type='password'
              fullWidth
              label='Password' name='password'
              onChange={this.handleFormChange}
              defaultValue=''
            />
            <Typography component='div' className={this.state.showErrorMsg ? null : 'hidden'}>
              <p>{this.state.errorMsg}</p>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.close} color='primary'>Cancel</Button>
            <Button onClick={this.login} color='primary'>Log in</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Login;
