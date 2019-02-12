import React, { Component } from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react'
import StartingFrame from './starting_frame';
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';
import ErrorFrame from './error_frame';
import TransactionFrame from './transaction_frame';
import SigningFrame from './signing_frame';
import { transaction } from 'easy_btc';
import { OperationResult } from '../util';
import errorIcon from '../icons/x-circle.svg';
import ErrorModal from './error_modal';

const startingFrameMeta = {
  value: 'starting',
  order: 0,
};
const contributionFrameMeta = {
  value: 'contribution',
  order: 1,
};
const paymentFrameMeta = {
  value: 'payment',
  order: 2,
};
const signingFrameMeta = {
  value: 'signing',
  order: 3,
};
const transactionFrameMeta = {
  value: 'transaction',
  order: 4,
};
const navLookup = [
  startingFrameMeta,
  contributionFrameMeta,
  paymentFrameMeta,
  signingFrameMeta,
  transactionFrameMeta,
];

class CenterFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: startingFrameMeta,
      txs: [],
      payments: [],
      privKeys: {},
      modTx: null,
      published: false,
      publishMessage: '',
      publishResult: '',
      loading: false,
      currency: 'Satoshi',
      modalOpen: false,
      network: null,
    };
  }

  handleOpenModal = () => this.setState({ modalOpen: true })
  handleCloseModal = () => this.setState({ modalOpen: false })

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
    // TODO change to use findIndex
    const txs = this.state.txs.filter((transaction)=>{
      return transaction.txHash !== txHash && !transaction.outputs['outputIndex'];
    });
    this.setState({txs});
  }

  removePayment = (address, amount) => {
    let payments = this.state.payments.slice(0);
    const paymentIndex = payments.findIndex((element) => {
      return element.to === address && element.amount === amount;
    });
    payments.splice(paymentIndex);
    this.setState({payments});
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

  removePrivateKey = (address) => {
    let privKeys = this.state.privKeys;
    delete privKeys[address];
    this.setState({privKeys});
  }

  setCurrency = (currency) => {
    this.setState({currency});
  }

  validate = () => {
    switch (this.state.frame.value) {
      case 'starting':
        return true;
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
      case 'starting':
        return (<StartingFrame callback={this.setTransactionMode}/>);
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
                              removePayment={this.removePayment}
                              currency={this.state.currency}
                              setCurrency={this.setCurrency}
                              network={this.state.network}/>);
      case 'signing':
        return <SigningFrame transactions={this.state.txs}
                             addPrivateKey={this.appendToPrivateKeys}
                             removePrivateKey={this.removePrivateKey}
                             privKeys={this.state.privKeys}/>;
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
      case 'starting':
        break;
      case 'contribution':
        buttons.push(nextNavButton);
        buttons.push(backNavButton);
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
        const publishButton = (<Button key={'publish'} style={{float: 'right', margin:0}} content='Publish Transaction' value='publish'
                                      icon='right arrow' labelPosition='right' onClick={this.publish}/>);
        buttons.push(publishButton);
        buttons.push(backNavButton);
        break;
      default:
        return <ErrorFrame />;
    }
    return buttons;
  }

  handleNavigation = (direction) => {
    if(direction === 'next' && !this.validate()) {
      alert('validation failed');
      return;
    }

    const directionValue = direction === 'next' ? 1: -1;
    const frame = navLookup[this.state.frame.order + directionValue];
    this.setState({frame});
  }

  handleClick = (e, { value }) => {
    this.handleNavigation(value);
  }

  setTransactionMode = (mode) => {
    switch (mode) {
      case 'mainnet':
        this.setState({network: mode});
        break;
      case 'testnet':
        this.setState({network: mode});
        break;
      default:
        alert('error');
        return false;
    }
    // TODO make sure that every return is bool
    return this.handleNavigation('next');
  }

  publish = () => {
    this.setState({loading: true});
    this.state.modTx.pushtx()
    .then((response) => {
      this.setState({loading: false, publish: true, publishMessage: response, modalOpen:true, publishResult:'Succeeded'});
    }).catch((error) => {
      console.log('center '+JSON.stringify(error));
      this.setState({loading: false, publish: true, publishMessage: error.message, modalOpen:true, publishResult:'Failed'});
    });
  }

  render() {
    console.log(`state ${JSON.stringify(this.state)}`);
    return (
      <div style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
        <Dimmer active={this.state.loading}>
          <Loader />
        </Dimmer>
        <ErrorModal message={this.state.publishMessage} open={this.state.modalOpen} handleOpen={this.handleOpenModal} handleClose={this.handleCloseModal} result={this.state.publishResult}/>
        {this.frame}
        <div style={{margin: '0.5rem'}}>
          {this.navigationButtons}
        </div>
      </div>
    );
  }
}

export default CenterFrame;
