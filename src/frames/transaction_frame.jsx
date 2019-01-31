import React, { Component }from 'react';
import ComplexSegmentGroup from '../Segment';
import { transaction, utils } from 'easy_btc';
import { Segment } from 'semantic-ui-react'
import TransactionTable from '../decode';

class TxBreakdown extends Component {

  constructor(props) {
    super(props);
    const tx = this.customTx();
    this.state = {
      tx: tx,
      txhash: utils.joinArray(tx.transactionDict).array.join(''),
      logs: utils.joinArray(tx.logger).array,
    };
  }

  defaultTx = () => {
    const privateKey = 'cUQuA4VSxUXug96eceSNR4c7Gym9Mvq3ev5pqm8pPWVtgM33bm3X';
    const transactionOutputs = [new transaction.TransactionOutput(1, '76a914c39a5a43ed93a4ee3066ac7a7f4fd1b36230f88588ac')]
    const trans = new transaction.Transaction('53c634b26689010ed9ea6e6b80b04cb98f05b99e1060e6399e690b379bcec4c5', transactionOutputs)
    const contributions = [trans.getContribution(1)];
    const payments = [new transaction.Payment(58000000, 'mtjjPJkzE8Rt6UqK2Ra7xonzPAaDdvsMfT')];

    const modTx = new transaction.ModularTransaction(contributions, payments);
    modTx.createRawTransaction();
    modTx.signTransaction([privateKey]);

    return modTx;
  }

  customTx = () => {
    console.log(JSON.stringify(this.props.privKeys));
    console.log(JSON.stringify(this.props.contributions));
    console.log(JSON.stringify(this.props.payments));
    const modTx = new transaction.ModularTransaction(this.props.contributions, this.props.payments);
    modTx.createRawTransaction();
    modTx.signTransaction(this.props.privKeys);

    return modTx;
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
