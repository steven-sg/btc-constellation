import React, { Component } from 'react';
import GridInputForm from './grid_input_form';
import { transaction } from 'easy_btc';

class ContributionInputManualFrame extends Component {

  state = {}

  get groups () {
    return [[{
        label: 'Transaction Hash',
        name: 'Transaction Hash',
        placeholder: 'Transaction Hash',
        width: 10,
      },
      {
        label: 'Output Index',
        name: 'Output Index',
        placeholder: 'Output Index',
        width: 6,
      }],
      [{
        label: 'ScriptPubKey',
        name: 'ScriptPubKey',
        placeholder: 'ScriptPubKey',
        width: 10,
      },
      {
        label: 'Balance',
        name: 'Balance',
        placeholder: 'Balance',
        width: 6,
      }]
    ]
  }

  callback = (state) => {
    const transactionOutput = [new transaction.TransactionOutput(state['Output Index'], state['ScriptPubKey'], state['Balance'])];
    const tx = new transaction.Transaction(state['Transaction Hash'], transactionOutput);
    this.props.callback(tx);
  }

  render() {
    return (
      <GridInputForm groups={this.groups} buttonText='Add Fund' callback={this.callback} />
    );
  }
}

export default ContributionInputManualFrame;
