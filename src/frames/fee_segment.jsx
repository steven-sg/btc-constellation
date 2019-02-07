import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'

class FeeSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get feeOptions () {
    return [{ key: 0, text: 'Manual', value: 'Manual' }];
  }

  get currencyOptions () {
    return [{ key: 0, text: 'mBTC/kB', value: 'mBTC/kB' }];
  }

  render() {
    return (
      <Menu style={{margin: '0.5rem'}}>
        <Dropdown item simple text={this.feeOptions[0].text} direction='right' options={this.feeOptions} />
        <Menu.Menu position='right'>
            <div className='ui transparent icon input'>
              <input className='prompt' style={{textAlign: 'right'}} type='text' placeholder='Fee' />
            </div>
          <Dropdown item simple text={this.currencyOptions[0].text} direction='right' options={this.currencyOptions} />
        </Menu.Menu>
      </Menu>
    );
  }
}

export default FeeSegment;
