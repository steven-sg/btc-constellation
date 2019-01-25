import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'

class BalanceSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {transaction: null}
  }

  get currencyOptions () {
    return [{ key: 0, text: 'mBTC', value: 'mBTC' }];
  }

  render() {
    return (
      <Menu>
        <Menu.Menu position='right'>
            <div className='ui transparent icon input'>
              <input className='prompt' style={{textAlign: 'right'}} type='text' placeholder='Balance' />
            </div>
          <Dropdown item simple text={this.currencyOptions[0].text} direction='right' options={this.currencyOptions} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default BalanceSegment;
