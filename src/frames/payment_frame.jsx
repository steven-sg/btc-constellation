import React, { Component } from 'react';
import BalanceSegment from './balance_segment';
import PaymentList from './payment_list';
import PaymentInputFrame from './payment_input_frame';

class PaymentFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const contributions = this.props.contributions;
    // TODO theres 3 versions of this functino
    const balance = contributions.reduce((sum, a) => {
      if (sum === null || a.output.balance === null) {
        return null;
      }
      return sum + Number(a.output.balance);
    }, 0);

    return (
      <div style={{width:'100%', flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <BalanceSegment balance={balance} currency={this.props.currency} callback={this.props.setCurrency} upward={false}/>
        <PaymentInputFrame callback={this.props.callback} currency={this.props.currency} network={this.props.network} tutorial={this.props.tutorial}/>
        <PaymentList payments={this.props.payments} currency={this.props.currency} callback={this.props.removePayment}/>
      </div>
    );
  }
}

export default PaymentFrame;
