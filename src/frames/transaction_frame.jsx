import React, { Component }from 'react';
import ComplexSegmentGroup from './segment';
// import TransactionTable from '../decode';
import TxHashSegment from './transaction_hash_segment';
import { utils } from 'easy_btc';
class TxBreakdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: props.transaction,
      txhash: utils.joinArray(props.transaction.transactionDict).array.join(''),
    };
  }

  render() {
    return (
      <div style={{width:'100%', flexGrow: '1', display: 'flex', flexDirection:'column'}}>
        {/* <TransactionTable tx={this.state.tx.transactionDict} /> */}
        <div style={{margin:'0.5rem'}}>
          {/* <Segment style={{overflow: 'auto', fontSize: '2.5em', padding: '1.5rem'}}>
          { this.state.txhash }
          </Segment> */}
          <TxHashSegment transaction={this.state.transaction}/>
        </div>
        <ComplexSegmentGroup transaction={this.state.transaction}/>
      </div>
    )
  }
};

export default TxBreakdown;
