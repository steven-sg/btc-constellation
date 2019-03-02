import React, { Component } from 'react';
import { lightLime, lime, darkLime } from '../style/colors';
import { Button, Segment, Input, Dropdown, Message, Transition } from 'semantic-ui-react'
import AddressList from './fees_address_list';
import transferIcon from '../icons/bitcoin-transfer.svg';
import AddressDropdown from './address_dropdown';
import { fees, transaction, model, utils } from 'easy_btc';

class FeesFrame extends Component {
  constructor(props) {
    super(props);
    const totalFee = props.returnPayment ? props.balance - props.returnPayment.amount : props.balance;
    const returnAddress = props.returnPayment ? props.returnPayment.to : '';
    const state = this.calculateFeeState(totalFee, returnAddress, props.returnPayment);
    this.state = {...{
      returnAddress: returnAddress,
      message: `Autmatic fee calculation may not be able to use the exact fee rate requested.
        In such cases it will instead use the closest fee rate possible.`,
    }, ...state};
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.returnAddress !== prevState.returnAddress) {
      const state = this.calculateFeeState(this.state.totalFee, this.state.returnAddress);
      this.setState(state);
      this.props.setReturnPayment(state.returnPayment);
    }
  }

  get currencyOptions () {
    return [
      { key: 'satoshi', text: 'satoshi', value: 'satoshi' },
    ];
  }

  get rateOptions () {
    return [
      { key: 'satoshi/kB', text: 'satoshi/kB', value: 'satoshi/kB' },
    ];
  }

  setReturnAddress = (returnAddress) => {
    this.setState({returnAddress});
  }

  handleChange = (e, {name, value}) => {
    const state = this.calculateFeeState(value, this.state.returnAddress);
    this.setState(state);
    this.props.setReturnPayment(state.returnPayment);
  }

  calculateDefaultAddressState = (totalFee, presetPayment) => {
    let payments = this.props.payments;
    if (presetPayment) {
      payments = [...payments, presetPayment]
    }
    const modTx = transaction.createSignedTransaction(
      this.props.contributions,
      payments,
      this.props.privKeysArg);
    const feeRate = Math.ceil(fees.getFeeRate(modTx, totalFee));
    // TODO do something about where returnAddress is stored please
    return {
      totalFee: totalFee,
      feeRate: feeRate,
      remainingBalance: 0,
      error: false,
      errorMessage: '',
      triggerAnimation: false,
      returnPayment: null,
    };
  }

  calculateFeeState = (value, returnAddress, presetPayment) => {
    if (!returnAddress || presetPayment) {
      return this.calculateDefaultAddressState(value, presetPayment);
    }
    const balance = this.props.balance - value;
    if (balance < 0) {
      return {
        totalFee: value,
        feeRate: '',
        remainingBalance: 'ERROR',
        error: true,
        errorMessage: 'Total fee must be less than or equal to the available balance.',
        triggerAnimation: true,
        returnPayment: null,
      };
    }
    const newPayment = new model.transaction.Payment(returnAddress, balance);
    const payments = [...this.props.payments, newPayment];
    const modTx = transaction.createSignedTransaction(
      this.props.contributions,
      payments,
      this.props.privKeysArg);
    const feeRate = Math.ceil(fees.getFeeRate(modTx, value));
    // TODO the way that this handles returnPayment kinda sucks
    return {
      totalFee: value,
      feeRate,
      remainingBalance: balance,
      error: false,
      errorMessage: '',
      triggerAnimation: false,
      returnPayment: newPayment,
    };
  }

  get message () {
    if (this.state.error) { 
      return (<Transition animation='shake' duration={200} visible={this.state.triggerAnimation}>
        <Message negative
                header='Invalid Input'
                content={
                  <p style={{overflowWrap: 'break-word'}}>
                    {this.state.errorMessage}
                  </p>
                }/>
      </Transition>);
    }
    return null;
  }
  render() {
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto'}}>
        <div style={{flexGrow: '1', display: 'flex', background: lime, margin: '0.5rem 0.5rem 0 0.5rem', borderRadius: '0.5rem 0.5rem 0 0'}}>
          <img style={{flexGrow:1}} src={transferIcon} alt={'transferIcon'}/>
        </div>
        <div style={{display: 'flex', flexDirection:'column', background: lime, margin: '0 0.5rem 0.5rem 0.5rem', borderRadius: '0 0 0.5rem 0.5rem'}}>
          <div style={{fontSize: '2em', margin: '2rem 2rem 1rem 2rem', textAlign:'center'}}>Remaining Balance: {this.state.remainingBalance} Satoshi</div>
          <div style={{display: 'flex', margin:'1rem 2rem 2rem 2rem'}}>
            <AddressDropdown setReturnAddress={this.setReturnAddress} returnAddress={this.state.returnAddress} addresses={this.props.addresses} network={this.props.network} tutorial={this.props.tutorial}/>
          </div>
          <div style={{display: 'flex', flexDirection:'column', padding:'2rem 1rem 1rem 1rem', background:lightLime, borderRadius: ' 0 0 0.5rem 0.5rem'}}>
            {this.message}
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Total Fees</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem', width: '20rem'}}
                     value={this.state.totalFee}
                     onChange={this.handleChange}
                     disabled={!this.state.returnAddress}
                     label={<Dropdown defaultValue={this.currencyOptions[0].value} options={this.currencyOptions} />}
                     labelPosition='right' type='number' min={0}
                     step={1}/>
            </div>
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Fee Rate</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem', width: '20rem'}}
                     value={this.state.feeRate}
                     onChange={this.handleChange}
                     disabled
                     label={<Dropdown defaultValue={this.rateOptions[0].value} options={this.rateOptions} />}
                     labelPosition='right' type='number' min={0}
                     step={1}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeesFrame;
