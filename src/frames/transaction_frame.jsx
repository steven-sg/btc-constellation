import React, { Component }from 'react';
import ComplexSegmentGroup from './segment';
import { Segment } from 'semantic-ui-react'
// import TransactionTable from '../decode';
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
          <Segment style={{overflow: 'auto', fontSize: '2.5em', padding: '1.5rem'}}>
          { this.state.txhash }
          </Segment>
        </div>
        <ComplexSegmentGroup transaction={this.state.transaction}/>
      </div>
    )
  }
};

export default TxBreakdown;
