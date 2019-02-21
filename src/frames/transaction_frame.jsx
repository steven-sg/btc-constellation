import React, { Component }from 'react';
import ComplexSegmentGroup from './segment';
// import { utils } from 'easy_btc';
import { Segment } from 'semantic-ui-react'
// import TransactionTable from '../decode';
import { fees, transaction, model, utils } from 'easy_btc';
class TxBreakdown extends Component {

  // constructor(props) {
  //   super(props);
  //   console.log('b',utils.joinArray(props.transaction.transactionDict).array.join(''));
  //   this.state = {
  //     txhash: utils.joinArray(props.transaction.transactionDict).array.join(''),
  //     logs: utils.joinArray(props.transaction.logger).array,
  //   };
  // }

  constructor(props) {
    super(props);
    const transactionOutputs1 = [new model.transaction.TransactionOutput(0, '76a914328dbf4cbeacc2898f096ffce5f9dcd27b53e5cc88ac')]
    const tx1 = new model.transaction.Transaction('68e7da9216d4e113df7918383258f7cec0a5cf661f469f68966aadf6a12358d3', transactionOutputs1)
    const contributions = [tx1.getContribution(0)];
    const payments = [
      new model.transaction.Payment('mjUDEsMXuYFZSrERVZjzHpznNJFzNUBoop', 10000000)];
    const p = new transaction.ModularTransaction(contributions, payments);
    p.createRawTransaction();
    p.signTransaction(['cRKHcyn9Diw4GmcAaxRUdJH3Kgaz3j1KBFq1i6QwC2U9STqK7YXm']);
    this.state = {
      transaction: p,
      txhash: utils.joinArray(p.transactionDict).array.join(''),
      logs: utils.joinArray(p.logger).array,
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
        <ComplexSegmentGroup items={ this.state.logs } transaction={this.state.transaction}/>
      </div>
    )
  }
};

export default TxBreakdown;
