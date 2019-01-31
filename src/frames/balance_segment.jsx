import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'

const options = [
  { key: 0, text: 'Satoshi', value: 'Satoshi' },
  { key: 1, text: 'mBTC', value: 'mBTC' },
  { key: 2, text: 'BTC', value: 'BTC' },
];

const fromSatoshiConversion = {
  Satoshi: (val) => (val),
  mBTC: (val) => (val / 100000),
  BTC: (val) => (val / 100000000).toFixed(8),
}

class BalanceSegment extends Component {
  constructor(props) {
    super(props);
    this.state = { dropdownValue: options[0].value };
  }

  handleChange = (e, { value }) => {
    this.setState({ dropdownValue: value });
  }

  render() {
    const { dropdownValue } = this.state;
    const balance = fromSatoshiConversion[dropdownValue](this.props.balance) || 0;
    return (
      <Menu>
        <Menu.Menu position='right'>
            <div className='ui transparent icon input'>
              <input className='prompt' style={{textAlign: 'right'}} type='text' placeholder='Balance' value={balance} disabled/>
            </div>
          <Dropdown value={dropdownValue} direction='right' options={options} onChange={this.handleChange} item simple/>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default BalanceSegment;
