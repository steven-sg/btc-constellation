import React, { Component } from 'react';
import BalanceSegment from './balance_segment';
import FeeSegment from './fee_segment';
import PaymentList from './payment_list';
import PaymentInputFrame from './payment_input_frame';

class ContributionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const contributions = this.props.contributions;
    const balance = contributions.reduce((sum, a) => sum + Number(a.output.balance), 0);

    return (
      <div style={{width:'100%', flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <BalanceSegment balance={balance} currency={this.props.currency} callback={this.props.setCurrency}/>
        <PaymentInputFrame callback={this.props.callback}/>
        <PaymentList payments={this.props.payments}/>
        <FeeSegment />
      </div>
    );
  }
}

export default ContributionFrame;
