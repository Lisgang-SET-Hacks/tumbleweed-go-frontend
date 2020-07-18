import React from 'react';
import Slider from '@material-ui/core/Slider';
import OLMap from './OLMap';

import './App.css';

function App() {
  
  return (
    <div className='container'>
      <OLMap />
      <div className='controls'>
        <Slider className='controls__slider' min={0} max={6} />
      </div>
    </div>
  );
}

export default App;
