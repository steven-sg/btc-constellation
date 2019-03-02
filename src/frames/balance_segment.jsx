import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'
import { unloggedUtils } from 'easy_btc';

const options = [
  { key: 0, text: 'Satoshi', value: 'Satoshi' },
  { key: 1, text: 'mBTC', value: 'mBTC' },
  { key: 2, text: 'BTC', value: 'BTC' },
];

class BalanceSegment extends Component {
  constructor(props) {
    super(props);
    this.state = { dropdownValue: options[0].value };
  }

  handleChange = (e, { value }) => {
    this.props.callback(value);
  }

  render() {
    const { currency } = this.props;
    const balance = unloggedUtils.convertCurrencyTo(this.props.balance, currency);
    return (
      <Menu style={{margin: '0.5rem'}}>
        <Menu.Menu position='right'>
            <div className='ui transparent icon input'>
              <input className='prompt' style={{textAlign: 'right'}} type='text' placeholder='Balance' value={balance} disabled/>
            </div>
          {/* <Dropdown value={dropdownValue} direction='right' options={options} onChange={this.handleChange} item simple/> */}
          <Dropdown item upward={this.props.upward} value={currency} options={options} onChange={this.handleChange}/>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default BalanceSegment;
