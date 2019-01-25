import React, { Component } from 'react';
import BalanceSegment from './balance_segment';
import FeeSegment from './fee_segment';
import List from './list';
import PaymentInputFrame from './payment_input_frame';
import { gold } from '../style/colors';
import { Dropdown, Menu, Button } from 'semantic-ui-react'

class ContributionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div style={{width:'100%', flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <BalanceSegment />
        <PaymentInputFrame />
        <List />
        <FeeSegment />
      </div>
    );
  }
}

export default ContributionFrame;
