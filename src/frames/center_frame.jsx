import React, { Component } from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
import { transaction, utils } from 'easy_btc';
import StartingFrame from './starting_frame';
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';
import ErrorFrame from './error_frame';
import FeesFrame from './fees_frame';
import TransactionFrame from './transaction_frame';
import SigningFrame from './signing_frame';
import { OperationResult } from '../util';
import ErrorModal from './error_modal';
import SubmissionModal from './submission_modal';
import HelpModal from './help_modal';

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
    this.state = CenterFrame.defaultState;
  }

  static get defaultState() {
    return {
      // Page controller
      frame: startingFrameMeta,
      // Transactions for transaction inputs
      txs: [],
      // Transactoin Outputs
      payments: [],
      privKeys: {},
      // The created transaction
      modTx: null,
      // Message of transaction submission
      publishMessage: '',
      // Result of transaction submission
      publishResult: '',
      loading: false,
      // Currency type
      currency: 'Satoshi',
      // Modal visibility
      modalOpen: false,
      // Bitcoin network type: testnet|mainnet
      network: null,
      error: false,
      errorMessage: '',
      // Return payment for change calculation
      returnPayment: null,
      // Tutorial mode activation
      tutorial: false,
      // Tutorial modal visibility
      showhelp: false,
    };
  }

  reset = () => {
    this.setState(CenterFrame.defaultState);
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  }

  handleCloseModal = () => {
    this.setState({
      modalOpen: false,
      error: false,
      showhelp: false,
    });
  }

  addTransactions = (txs) => {
    const transactions = Array.isArray(txs) ? txs : [txs];
    const validation = this.checkDuplicateTransactions(transactions);
    if (!validation.success) {
      return validation;
    }
    let stateTxs = this.state.txs.slice(0);
    stateTxs = [...stateTxs, ...transactions];
    this.setState({ txs: stateTxs });
    return new OperationResult(true);
  }

  checkDuplicateTransactions = (txs) => {
    const transactions = Array.isArray(txs) ? txs : [txs];
    const stateTxs = this.state.txs;
    let result = new OperationResult(true);

    nestedLoops: for (let i = 0; i < transactions.length; i += 1) {
      const transaction = transactions[i];
      for (let j = 0; j < stateTxs.length; j += 1) {
        const tx = stateTxs[j];
        if (transaction.txHash === tx.txHash && Object.keys(transaction.outputs)[0] === Object.keys(tx.outputs)[0]) {
          // TODO Object keys implementation above assumes single output transaction
          result = new OperationResult(
            false,
            new Error(`${tx.txHash}:${Object.keys(tx.outputs)[0]} already exists. Please remove the transaction and try again.`),
          );
          break nestedLoops;
        }
      }
    }

    return result;
  }

  removeTransaction = (txHash, outputIndex) => {
    const txs = this.state.txs.slice(0);
    const txIndex = txs.findIndex(tx => tx.txHash === txHash && Object.keys(tx.outputs)[0] === outputIndex);
    txs.splice(txIndex, 1);
    this.setState({ txs });
    this.removePrivateKey(`${txHash}:${outputIndex}`);
  }

  removePayment = (address, amount) => {
    const payments = this.state.payments.slice(0);
    const paymentIndex = payments.findIndex(element => element.to === address && element.amount === amount);
    payments.splice(paymentIndex, 1);
    this.setState({ payments });
  }

  appendToPayments = (payment) => {
    if (this.calculateBalance() - payment.amount < 0) {
      return new OperationResult(false, new Error('Insufficient funds.'));
    }
    const payments = this.state.payments.slice(0);
    payments.push(payment);
    this.setState({ payments });
    return new OperationResult(true);
  }

  appendToPrivateKeys = (address, priv) => {
    const { privKeys } = this.state;
    privKeys[address] = priv;
    this.setState({ privKeys });
  }

  removePrivateKey = (address) => {
    const { privKeys } = this.state;
    delete privKeys[address];
    this.setState({ privKeys });
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
    });
    return addressesCopy;
  }

  getAllAddresses = () => {
    const addresses = this.getAddressesFromPrivs();
    return this.getAddressesFromPayments(addresses);
  }

  setCurrency = (currency) => {
    this.setState({ currency });
  }

  setReturnPayment = (returnPayment) => {
    this.setState({ returnPayment });
  }

  validate = () => {
    switch (this.state.frame.value) {
      case 'starting':
        return new OperationResult(true);
      case 'contribution':
        if (this.state.txs.length) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please add at least one contribution to continue.'));
      case 'payment':
        if (this.state.payments.length) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please add at least one payment to continue.'));
      case 'signing':
        if (this.validatePrivKeys()) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please ensure that you have unlocked each of the transactions.'));
      case 'fees':
        if (this.validatePrivKeys()) {
          return new OperationResult(true);
        }
        return new OperationResult(false, new Error('Please ensure that you have unlocked each of the transactions.'));
      case 'transaction':
        return new OperationResult(false);
      default:
        return new OperationResult(false);
    }
  }

  calculateBalance = () => {
    const totalContributionValue = this.contributions.reduce((sum, a) => sum + Number(a.output.balance), 0);

    const totalPaymentValue = this.state.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    return totalContributionValue - totalPaymentValue;
  }

  getPrivKeyArgs = () => {
    const privKeysArg = [];
    let isValid = true;
    this.contributions.forEach((contribution) => {
      const priv = this.state.privKeys[`${contribution.txHash}:${contribution.output.outputIndex}`];
      if (priv) {
        privKeysArg.push(priv);
        return;
      }
      isValid = false;
    });
    if (isValid) {
      return privKeysArg;
    }
    // todo this is really bad
    return isValid;
  }

  get modTransaction() {
    const privKeysArg = this.getPrivKeyArgs();

    const payments = this.state.payments.slice(0);
    if (this.state.returnPayment) {
      payments.push(this.state.returnPayment);
    }
    const modTx = transaction.createSignedTransaction(this.contributions, payments, privKeysArg);
    return modTx;
  }

  validatePrivKeys = () => {
    // TODO not ideal validation
    const privs = this.getPrivKeyArgs();
    if (!privs) {
      return false;
    }
    this.setState({ modTx: this.modTransaction });
    return true;
  }

  get contributions() {
    let contributions = [];
    this.state.txs.forEach((tx) => {
      contributions = contributions.concat(tx.getContributions());
    });
    return contributions;
  }

  get frame() {
    switch (this.state.frame.value) {
      case 'starting':
        return (<StartingFrame callback={this.setTransactionMode} />);
      case 'contribution':
        return (
          <ContributionFrame
            addTransactions={this.addTransactions}
            removeTransaction={this.removeTransaction}
            contributions={this.contributions}
            currency={this.state.currency}
            balance={this.calculateBalance()}
            setCurrency={this.setCurrency}
            tutorial={this.state.tutorial}
            network={this.state.network}
          />
        );
      case 'payment':
        return (
          <PaymentFrame
            callback={this.appendToPayments}
            payments={this.state.payments}
            balance={this.calculateBalance()}
            removePayment={this.removePayment}
            currency={this.state.currency}
            setCurrency={this.setCurrency}
            network={this.state.network}
            tutorial={this.state.tutorial}
          />
        );
      case 'signing':
      // TODO this should probably be passing around contributions, not transactions
        return (
          <SigningFrame
            transactions={this.state.txs}
            addPrivateKey={this.appendToPrivateKeys}
            removePrivateKey={this.removePrivateKey}
            privKeys={this.state.privKeys}
            tutorial={this.state.tutorial}
          />
        );
      case 'fees':
        return (
          <FeesFrame
            addresses={this.getAllAddresses()}
            contributions={this.contributions}
            payments={this.state.payments}
            privKeysArg={this.getPrivKeyArgs()}
            balance={this.calculateBalance()}
            network={this.state.network}
            tutorial={this.state.tutorial}
            currency={this.state.currency}
            setCurrency={this.setCurrency}
            setReturnPayment={this.setReturnPayment}
            returnPayment={this.state.returnPayment}
          />
        );
      case 'transaction':
        return (
          <TransactionFrame
            contributions={this.contributions}
            payments={this.state.payments}
            transaction={this.state.modTx}
          />
        );
      default:
        return <ErrorFrame />;
    }
  }

  get navigationButtons() {
    const nextNavButton = (
      <Button
        key="next"
        style={{ float: 'right', margin: 0 }}
        content="Next"
        value="next"
        icon="right arrow"
        labelPosition="right"
        onClick={this.handleClick}
      />
    );
    const backNavButton = (
      <Button
        key="back"
        style={{ float: 'left', margin: 0 }}
        content="Back"
        value="back"
        icon="left arrow"
        labelPosition="left"
        onClick={this.handleClick}
      />
    );
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
      case 'transaction': {
        const publishButton = (
          <Button
            key="publish"
            style={{ float: 'right', margin: 0 }}
            content="Publish Transaction"
            value="publish"
            icon="right arrow"
            labelPosition="right"
            onClick={this.publish}
          />
        );
        buttons.push(publishButton);
        buttons.push(backNavButton);
        break;
      }
      default:
        return <ErrorFrame />;
    }
    return buttons;
  }

  handleNavigation = (direction, showModal) => {
    if (direction === 'back' && this.state.frame === contributionFrameMeta) {
      this.reset();
    } else {
      if (direction === 'next') {
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

      const directionValue = direction === 'next' ? 1 : -1;
      const frame = navLookup[this.state.frame.order + directionValue];
      // TODO this way of show modal might not be ideal
      const showhelp = !!(this.state.tutorial || showModal);
      const modalOpen = showhelp;
      this.setState({
        frame,
        showhelp,
        modalOpen,
      });
    }
  }

  handleClick = (e, { value }) => {
    this.handleNavigation(value);
  }

  setTransactionMode = (mode) => {
    switch (mode) {
      case 'mainnet':
        this.setState({ network: mode });
        break;
      case 'testnet':
        this.setState({ network: mode });
        break;
      case 'tutorial':
        this.setState({
          network: 'testnet',
          tutorial: true,
        });
        return this.handleNavigation('next', true);
      default:
        alert('error');
        return false;
    }
    // TODO make sure that every return is bool
    return this.handleNavigation('next');
  }

  publish = () => {
    if (this.state.tutorial) {
      this.setState({ modalOpen: true, publishResult: 'Succeeded' });
    } else {
      this.setState({ loading: true });
      this.state.modTx.pushtx(this.state.network)
        .then((response) => {
          this.setState({
            loading: false, publishMessage: response.data, modalOpen: true, publishResult: 'Succeeded',
          });
        }).catch((error) => {
          this.setState({
            loading: false, publishMessage: error.message, modalOpen: true, publishResult: 'Failed',
          });
        });
    }
  }

  get modal() {
    if (this.state.error) {
      return (
        <ErrorModal
          message={this.state.errorMessage}
          open={this.state.modalOpen}
          handleOpen={this.handleOpenModal}
          handleClose={this.handleCloseModal}
        />
      );
    } if (this.state.showhelp) {
      return (
        <HelpModal
          open={this.state.modalOpen}
          handleOpen={this.handleOpenModal}
          handleClose={this.handleCloseModal}
          frame={this.state.frame.value}
        />
      );
    }
    return (
      <SubmissionModal
        message={this.state.publishMessage}
        open={this.state.modalOpen}
        handleOpen={this.handleOpenModal}
        handleClose={this.handleCloseModal}
        result={this.state.publishResult}
        tutorial={this.state.tutorial}
        reset={this.reset}
      />
    );
  }

  render() {
    return (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      }}
      >
        <Dimmer active={this.state.loading}>
          <Loader />
        </Dimmer>
        {this.modal}
        {this.frame}
        <div style={{ margin: '0.5rem' }}>
          {this.navigationButtons}
        </div>
      </div>
    );
  }
}

export default CenterFrame;
