import React, { Component } from 'react';
import TxBreakdown from '../TxList';
import TxForm from '../TxForm';
import TransactionTable from '../decode';

class TransactionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {transaction: null};
  }

  formCallback = (data) => {
    this.setState({ transaction: data });
  }

  render() {
    return (
      <div >
        <TxForm callback={this.formCallback}/>
        { this.state.transaction && <TxBreakdown tx={this.state.transaction} /> }
      </div>
    );
  }
}

export default TransactionFrame;
