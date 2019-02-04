import React, { Component }from 'react';
import ComplexSegmentGroup from './segment';
import { utils } from 'easy_btc';
import { Segment } from 'semantic-ui-react'
import TransactionTable from '../decode';

class TxBreakdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txhash: utils.joinArray(props.transaction.transactionDict).array.join(''),
      logs: utils.joinArray(props.transaction.logger).array,
    };
  }

  render() {
    return (
      <div style={{width:'100%', flexGrow: '1', display: 'flex', flexDirection:'column'}}>
        {/* <TransactionTable tx={this.state.tx.transactionDict} /> */}
        <Segment.Group>
          <Segment style={{overflow: 'auto', fontSize: '2.5em', padding: '1.5rem'}}>
          { this.state.txhash }
          </Segment>
        </Segment.Group>
        <ComplexSegmentGroup items={ this.state.logs }/>
      </div>
    )
  }
};

export default TxBreakdown;
