import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import './Notification.css';

class Notification extends React.Component {
  constructor(props){
    super(props);

  }
  
  render(){
    return (
      // <Snackbar open={true} onClose={() => this.props.closeFunc(this.props._id)}>
      //   <Alert onClose={() => this.props.closeFunc(this.props._id)} severity={this.props.severity}>
      //     <AlertTitle>{this.props.title}</AlertTitle>
      //     {this.props.body}
      //   </Alert>
      // </Snackbar>
      <div className={'notification ' + this.props.severity}>
        <h3>{this.props.title}</h3><br />
        <p>{this.props.body}</p>
        <IconButton className='closeIcon' color="secondary" onClick={() => this.props.closeFunc(this.props._id)}>
          <CloseIcon />
        </IconButton>
      </div>
    )
  }
}

export default Notification;