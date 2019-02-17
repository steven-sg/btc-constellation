import React, { Component } from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react'
import StartingFrame from './starting_frame';
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';
import ErrorFrame from './error_frame';
import FeesFrame from './fees_frame';
import TransactionFrame from './transaction_frame';
import SigningFrame from './signing_frame';
import { transaction, utils } from 'easy_btc';
import { OperationResult } from '../util';
import ErrorModal from './error_modal';
import SubmissionModal from './submission_modal';

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
const feesFrameMeta = {
  value: 'fees',
  order: 4,
};
const transactionFrameMeta = {
  value: 'transaction',
  order: 5,
};
const navLookup = [
  startingFrameMeta,
  contributionFrameMeta,
  paymentFrameMeta,
  signingFrameMeta,
  feesFrameMeta,
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
      error: false,
      errorMessage: '',
      changePayment: '',
      tutorial: false,
    };
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  }

  handleCloseModal = () => {
    this.setState({
      modalOpen: false,
      error: false,
    });
  }

  addTransaction = (tx) => {
    let duplicateTx = false;
    this.state.txs.forEach((transaction) => {
      if (!duplicateTx && transaction.txHash === tx.txHash && Object.keys(transaction.outputs)[0] === Object.keys(tx.outputs)[0]) {
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
    let txs = this.state.txs.slice(0);
    const txIndex = txs.findIndex((tx) => {
      return tx.txHash === txHash && Object.keys(tx.outputs)[0] === outputIndex;
    });
    txs.splice(txIndex, 1);
    this.setState({txs});
    this.removePrivateKey(`${txHash}:${outputIndex}`);
  }

  removePayment = (address, amount) => {
    let payments = this.state.payments.slice(0);
    const paymentIndex = payments.findIndex((element) => {
      return element.to === address && element.amount === amount;
    });
    payments.splice(paymentIndex, 1);
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
    return true; //TODO does this.setState return a truthly value?
  }

  removePrivateKey = (address) => {
    let privKeys = this.state.privKeys;
    delete privKeys[address];
    this.setState({privKeys});
  }

  getAddressesFromPrivs = (addresses) => {
    const addressesCopy = addresses ? addresses.slice(0) : [];
    Object.keys(this.state.privKeys).forEach((key) => {
      const priv = this.state.privKeys[key];
      const address = utils.privToAddress(priv, this.state.network);
      if (!addressesCopy.includes(address)) {
        addressesCopy.push(address);
      }
    });
    return addressesCopy;
  }

  getAddressesFromPayments = (addresses) => {
    const addressesCopy = addresses ? addresses.slice(0) : [];
    this.state.payments.forEach((payment) => {
      if (!addressesCopy.includes(payment.to)) {
        addressesCopy.push(payment.to);
      }
    })
    return addressesCopy;
  }

  getAllAddresses = () => {
    const addresses = this.getAddressesFromPrivs();
    return this.getAddressesFromPayments(addresses);
  }

  setCurrency = (currency) => {
    this.setState({currency});
  }

  setChangePayment = (changePayment) => {
    this.setState({changePayment});
  }

  validate = () => {
    switch (this.state.frame.value) {
      case 'starting':
        return new OperationResult(true);
      case 'contribution':
        if(this.state.txs.length) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please add at least one contribution to continue.'));
      case 'payment':
        if(this.state.payments.length) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please add at least one payment to continue.'));
      case 'signing':
        if(this.validatePrivKeys()) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please ensure that you have unlocked each of the transactions.'));
      case 'fees':
        return new OperationResult(true);
      case 'transaction':
        return new OperationResult(false);
      default:
        return new OperationResult(false);
    }
  }

  calculateBalance = () => {
    const totalContributionValue = this.contributions.reduce((sum, a) => {
      if (sum === null || a.output.balance === null) {
        return null;
      }
      return sum + Number(a.output.balance);
    }, 0);
  
    if (totalContributionValue === null) {
      return null;
    }

    const totalPaymentValue = this.state.payments.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0);
  
    return totalContributionValue - totalPaymentValue;
  }
  getPrivKeyArgs = () => {
    const privKeysArg = [];
    let isValid = true;
    this.contributions.forEach((contribution) => {
      const priv = this.state.privKeys[`${contribution.txHash}:${contribution.output.outputIndex}`];
      if(priv) {
        privKeysArg.push(priv);
        return;
      }
      isValid = false;
    });
    console.log('contributions ' + JSON.stringify(this.contributions));
    console.log('privKeyArgs ' + privKeysArg);
    console.log('isValid ' + isValid);
    if (isValid) {
      return privKeysArg;
    }
    //todo this is really bad
    return isValid;
  }

  validatePrivKeys = () => {
    const privKeysArg = this.getPrivKeyArgs()

    if (privKeysArg) {
      const modTx = transaction.createSignedTransaction(this.contributions, this.state.payments, privKeysArg);
      this.setState({modTx});
      return true;
    }
    return false;
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
                                   setCurrency={this.setCurrency}
                                   tutorial={this.state.tutorial}/>);
      case 'payment':
        return (<PaymentFrame callback={this.appendToPayments}
                              contributions={this.contributions}
                              payments={this.state.payments}
                              removePayment={this.removePayment}
                              currency={this.state.currency}
                              setCurrency={this.setCurrency}
                              network={this.state.network}
                              tutorial={this.state.tutorial}/>);
      case 'signing':
      // TODO this should probably be passing around contributions, not transactions
        return <SigningFrame transactions={this.state.txs}
                             addPrivateKey={this.appendToPrivateKeys}
                             removePrivateKey={this.removePrivateKey}
                             privKeys={this.state.privKeys}
                             tutorial={this.state.tutorial}/>;
      case 'fees':
        return (<FeesFrame callback={this.changePayment}
                           addresses={this.getAllAddresses()}
                           contributions={this.contributions}
                           payments={this.state.payments}
                           privKeysArg={this.getPrivKeyArgs()}
                           balance={this.calculateBalance()}/>);
      case 'transaction':
        return <TransactionFrame contributions={this.contributions}
                                 payments={this.state.payments}
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
      case 'fees':
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
    if(direction === 'next') {
      const validationResult = this.validate();
      if (!validationResult.success) {
        this.setState({
          error: true,
          errorMessage: validationResult.error.message,
          modalOpen: true,
        });
        return;
      }
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
      case 'tutorial':
        this.setState({
          network: 'testnet',
          tutorial: true,
        });
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
      this.setState({loading: false, publish: true, publishMessage: error.message, modalOpen:true, publishResult:'Failed'});
    });
  }

  render() {
    return (
      <div style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
        <Dimmer active={this.state.loading}>
          <Loader />
        </Dimmer>
        { this.state.error ?
          <ErrorModal message={this.state.errorMessage} open={this.state.modalOpen} handleOpen={this.handleOpenModal} handleClose={this.handleCloseModal}/>
          : <SubmissionModal message={this.state.publishMessage} open={this.state.modalOpen} handleOpen={this.handleOpenModal} handleClose={this.handleCloseModal} result={this.state.publishResult}/> }
        {this.frame}
        <div style={{margin: '0.5rem'}}>
          {this.navigationButtons}
        </div>
      </div>
    );
  }
}

export default CenterFrame;
