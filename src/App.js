import './App.css';
import React, { Component } from 'react';
import CenterFrame from './frames/center_frame';
import ContributionFrame from './frames/contribution_frame';


const style = {
  width: '100%',
  height: '100%',
  padding: '1rem',
}

class App extends Component {
  render() {
    return (
      <div className="App" style={style}>
        <CenterFrame />
        {/* <ContributionFrame /> */}
      </div>
    );
  }
}

export default App;
