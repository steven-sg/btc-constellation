import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

class StartingFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (e, { value }) => {
    return this.props.callback(value);
  }

  render() {
    return (
      <div style={{flexGrow: '1', display: 'flex'}}>
        <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems:'center'}}>
          <h1 style={{color: 'white'}}>
            Welcome
          </h1>
          <p style={{color: 'white'}}>
            Click one of the buttons on the right to begin.
          </p>
        </div>
        <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto', marginTop: '0.5rem'}}>
          <Button style={{flexGrow:1, margin: '0.5rem', fontWeight:'bolder', opacity:0.9}} value='mainnet' onClick={this.handleClick} size='large' color='violet'>
            Create Mainnet Transaction
          </Button>
          <Button style={{flexGrow:1, margin: '0.5rem', fontWeight:'bolder', opacity:0.9}} value='testnet' onClick={this.handleClick} size='large' color='violet'>
            Create Testnet Transaction
          </Button>
          {/* <Button style={{flexGrow:1}} value='segwit' onClick={this.handleClick}>Create Segwit Transaction (under development)</Button> */}
          <Button style={{flexGrow:1, margin: '0.5rem', fontWeight:'bolder', opacity:0.9}} value='tutorial' onClick={this.handleClick} size='large' color='violet'>
            Tutorial
          </Button>
        </div>
      </div>

    );
  }
}

export default StartingFrame;
