import React, { Component } from 'react';
import CenterFrame from './frames/center_frame';

const style = {
  width: '100%',
  height: '100%',
  padding: '0.5rem',
}

class App extends Component {
  render() {
    return (
      <div className="App" style={style}>
        <CenterFrame />
      </div>
    );
  }
}

export default App;
