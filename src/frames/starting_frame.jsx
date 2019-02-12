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
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto', marginTop: '0.5rem'}}>
        <Button style={{flexGrow:1}} value='mainnet' onClick={this.handleClick}>Create Mainnet Transaction</Button>
        <Button style={{flexGrow:1}} value='testnet' onClick={this.handleClick}>Create Testnet Transaction</Button>
        <Button style={{flexGrow:1}} value='segwit' onClick={this.handleClick}>Create Segwit Transaction (under development)</Button>
        <Button style={{flexGrow:1}} value='tutorial' onClick={this.handleClick}>Tutorial (under development)</Button>
      </div>
    );
  }
}

export default StartingFrame;
