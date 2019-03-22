import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { currency as currencyUtil } from 'easy_btc';

const options = [
  { key: 0, text: 'Satoshi', value: 'Satoshi' },
  { key: 1, text: 'mBTC', value: 'mBTC' },
  { key: 2, text: 'BTC', value: 'BTC' },
];

class BalanceSegment extends Component {
  handleChange = (e, { value }) => {
    this.props.callback(value);
  }

  render() {
    const { currency, balance, upward } = this.props;
    const formattedBalance = currencyUtil.convertCurrencyTo(balance, currency);
    return (
      <Menu style={{ margin: '0.5rem' }}>
        <Menu.Menu position="right">
          <div className="ui transparent icon input">
            <input className="prompt" style={{ textAlign: 'right' }} type="text" placeholder="Balance" value={formattedBalance} disabled />
          </div>
          <Dropdown item upward={upward} value={currency} options={options} onChange={this.handleChange} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default BalanceSegment;
