import React, { Component } from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react'
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';
import ErrorFrame from './error_frame';
import TransactionFrame from './transaction_frame';
import SigningFrame from './signing_frame';
// import TransactionModel from './transaction_publish_model';
import { transaction } from 'easy_btc';
import { OperationResult } from '../util';

const contributionFrameMeta = {
  value: 'contribution',
  order: 0,
};
const paymentFrameMeta = {
  value: 'payment',
  order: 1,
};
const signingFrameMeta = {
  value: 'signing',
  order: 2,
};
const transactionFrameMeta = {
  value: 'transaction',
  order: 3,
};
const navLookup = [
  contributionFrameMeta,
  paymentFrameMeta,
  signingFrameMeta,
  transactionFrameMeta,
];

class CenterFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: contributionFrameMeta,
      txs: [],
      payments: [],
      privKeys: {},
      modTx: null,
      published: false,
      publishMessage: null,
      loading: false,
      currency: 'Satoshi',
    };
  }

  addTransaction = (tx) => {
    let duplicateTx = false;
    this.state.txs.forEach((transaction) => {
      if (!duplicateTx && transaction.txHash === tx.txHash && transaction.outputIndex === tx.outputIndex) {
        duplicateTx = true;
      }
    });
    if (!duplicateTx) {
      let txs = this.state.txs.slice(0);
      txs.push(tx);
      this.setState({txs});
      return new OperationResult(true);
    }
    return new OperationResult(false, new Error(`${tx.txHash}:${tx.outputIndex} already exists. Duplicate contributions are not allowed.`));
  }

  removeTransaction = (txHash, outputIndex) => {
    const txs = this.state.txs.filter((transaction)=>{
      return transaction.txHash !== txHash && !transaction.outputs[outputIndex];
    });
    this.setState({txs});
  }

  appendToPayments = (payment) => {
    let payments = this.state.payments.slice(0);
    payments.push(payment);
    this.setState({payments});
  }

  appendToPrivateKeys = (address, priv) => {
    let privKeys = this.state.privKeys;
    privKeys[address] = priv;
    this.setState({privKeys});
  }

  setCurrency = (currency) => {
    this.setState({currency});
  }
  validate = () => {
    switch (this.state.frame.value) {
      case 'contribution':
        if(this.state.txs.length) {
          return true;
        }
        break;
      case 'payment':
        if(this.state.payments.length) {
          return true;
        }
        break;
      case 'signing':
        if(this.validatePrivKeys()) {
          return true;
        }
        break;
      case 'transaction':
        break;
      default:
        break;
    }
    return false;
  }

  validatePrivKeys = () => {
    const privKeysArg = [];
    let isValid = true;

    this.contributions.forEach(contribution => {
      const priv = this.state.privKeys[contribution.txHash];
      if(priv) {
        privKeysArg.push(priv);
        return;
      }
      isValid = false;
    });

    if (isValid) {
      const modTx = new transaction.ModularTransaction(this.contributions, this.state.payments);
      modTx.createRawTransaction();
      modTx.signTransaction(privKeysArg);
      this.setState({privKeysArg, modTx});
    }
    return isValid;
  }

  get contributions () {
    let contributions = [];
    this.state.txs.forEach(tx => contributions = contributions.concat(tx.getContributions()));
    return contributions;
  }

  get frame () {
    switch (this.state.frame.value) {
      case 'contribution':
        return (<ContributionFrame addTransaction={this.addTransaction}
                                   removeTransaction={this.removeTransaction}
                                   contributions={this.contributions} 
                                   currency={this.state.currency}
                                   setCurrency={this.setCurrency}/>);
      case 'payment':
        return (<PaymentFrame callback={this.appendToPayments}
                              contributions={this.contributions}
                              payments={this.state.payments}
                              currency={this.state.currency}
                              setCurrency={this.setCurrency}/>);
      case 'signing':
        return <SigningFrame transactions={this.state.txs}
                             callback={this.appendToPrivateKeys}/>;
      case 'transaction':
        return <TransactionFrame contributions={this.contributions}
                                 payments={this.state.payments}
                                 privKeys={this.state.privKeysArg}
                                 transaction={this.state.modTx}/>;
      default:
        return <ErrorFrame />;
    }
  }

  get navigationButtons () {
    const nextNavButton = (<Button key={'next'} style={{float: 'right', margin: 0}} content='Next' value='next'
                                   icon='right arrow' labelPosition='right' onClick={this.handleClick}/>)
    const backNavButton = (<Button key={'back'} style={{float: 'left', margin: 0}} content='Back' value='back'
                                   icon='left arrow' labelPosition='left' onClick={this.handleClick}/>);
    const buttons = [];
    switch (this.state.frame.value) {
      case 'contribution':
        buttons.push(nextNavButton);
        break;
      case 'payment':
        buttons.push(nextNavButton);
        buttons.push(backNavButton);
        break;
      case 'signing':
        buttons.push(nextNavButton);
        buttons.push(backNavButton);
        break;
      case 'transaction':
        const publishButton = (<Button key={'publish'} style={{float: 'right'}} content='Publish Transaction' value='publish'
                                      icon='right arrow' labelPosition='right' onClick={this.publish}/>);
        buttons.push(publishButton);
        buttons.push(backNavButton);
        break;
      default:
        return <ErrorFrame />;
    }
    return buttons;
  }

  handleClick = (e, { value }) => {
    if(value === 'next' && !this.validate()) {
      alert('validation failed');
      return;
    }

    const direction = value === 'next' ? 1: -1;
    const frame = navLookup[this.state.frame.order + direction];
    this.setState({frame});
  }

  publish = () => {
    this.setState({loading: true})
    this.state.modTx.pushtx()
      .catch((error) => {
        return error;
      }).then((response) => {
        this.setState({loading: false, publish: true, publishMessage: response})
      });
  }

  render() {
    return (
      <div style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
        <Dimmer active={this.state.loading}>
          <Loader />
        </Dimmer>
        {/* {this.state.published && <TransactionModel message={this.state.publishMessage} open/>} */}
        {this.frame}
        <div style={{margin: '0.5rem'}}>
          {this.navigationButtons}
        </div>
      </div>
    );
  }
}

export default CenterFrame;
