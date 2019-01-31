import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';
import ErrorFrame from './error_frame';
import TransactionFrame from './transaction_frame';
import SigningFrame from './signing_frame';

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
    };
  }

  appendToTransaction = (tx) => {
    let txs = this.state.txs.slice(0);
    txs.push(tx);
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
    let validation = true;

    this.contributions.forEach(contribution => {
      const priv = this.state.privKeys[contribution.txHash];
      if(priv) {
        privKeysArg.push(priv);
        return;
      }
      validation = false;
    });

    this.setState({privKeysArg});
    return validation;
  }

  get contributions () {
    let contributions = [];
    this.state.txs.forEach(tx => contributions = contributions.concat(tx.getContributions()));
    return contributions;
  }

  get frame () {
    switch (this.state.frame.value) {
      case 'contribution':
        return (<ContributionFrame callback={this.appendToTransaction}
                                   contributions={this.contributions} />);
      case 'payment':
        return (<PaymentFrame callback={this.appendToPayments}
                              contributions={this.contributions}
                              payments={this.state.payments} />);
      case 'signing':
        return <SigningFrame transactions={this.state.txs} callback={this.appendToPrivateKeys} />;
        // return <StickyExampleAdjacentContext />;
      case 'transaction':
        return <TransactionFrame contributions={this.contributions} payments={this.state.payments} privKeys={this.state.privKeysArg}/>;
        // return <StickyExampleAdjacentContext />;
      default:
        return <ErrorFrame />;
    }
  }

  get navigationButtons () {
    const nextNavButton = (<Button style={{float: 'right'}} content='Next' value='next'
                                   icon='right arrow' labelPosition='right' onClick={this.handleClick}/>)
    const backNavButton = (<Button style={{float: 'left'}} content='Back' value='back'
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

  render() {
    return (
      <div style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
        {this.frame}
        <div style={{flexBasis: 0, marginTop: '1rem'}}>
          {this.navigationButtons}
        </div>
      </div>
    );
  }
}

export default CenterFrame;
