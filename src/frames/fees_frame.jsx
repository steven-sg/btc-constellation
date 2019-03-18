import React, { Component } from 'react';
import { lightLime, lime } from '../style/colors';
import { Input, Dropdown, Message, Transition } from 'semantic-ui-react'
import AddressList from './fees_address_list';
import transferIcon from '../icons/bitcoin-transfer.svg';
import AddressDropdown from './address_dropdown';
import { fees, transaction, models, currency } from 'easy_btc';

const currencyOptions = [
  { key: 0, text: 'Satoshi', value: 'Satoshi' },
  { key: 1, text: 'mBTC', value: 'mBTC' },
  { key: 2, text: 'BTC', value: 'BTC' },
];

const sizeOptions = [
  {
    key: 'byte',
    text: 'bytes',
    value: 'byte',
  },
  {
    key: 'kB',
    text: 'kB',
    value: 'kB',
  },
];

class FeesFrame extends Component {
  constructor(props) {
    super(props);
    const totalFeeSatoshi = props.returnPayment ? props.balance - props.returnPayment.amount : props.balance;
    const totalFee = currency.convertCurrencyTo(totalFeeSatoshi, this.props.currency);
    const returnAddress = props.returnPayment ? props.returnPayment.to : '';
    const state = this.calculateFeeState(totalFeeSatoshi, returnAddress, props.returnPayment);
    this.state = {...{
      returnAddress: returnAddress,
      message: `Autmatic fee calculation may not be able to use the exact fee rate requested.
        In such cases it will instead use the closest fee rate possible.`,
      sizeUnit: this.rateOptions[0].value,
      totalFee,
    }, ...state};
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.returnAddress !== prevState.returnAddress) {
      const rawFee = currency.convertCurrencyTo(this.state.totalFee, 'satoshi', this.props.currency);
      const state = this.calculateFeeState(rawFee, this.state.returnAddress);
      this.setState({...state, totalFee: currency.convertCurrencyTo(rawFee, this.props.currency)});
      this.props.setReturnPayment(state.returnPayment);
    } if (this.props.currency !== prevProps.currency) {
      const totalFee = currency.convertCurrencyTo(this.state.totalFee, this.props.currency, prevProps.currency);
      this.setState({totalFee});
    }
  }

  get rateOptions () {
    return [
      {
        key: 'byte',
        text: `${this.props.currency}/byte`,
        value: 'byte',
      },
      {
        key: 'kB',
        text: `${this.props.currency}/kB`,
        value: 'kB',
      },
    ];
  }

  changeSizeUnit = (e, {value}) => {
    this.setState({sizeUnit: value});
  }
  setReturnAddress = (returnAddress) => {
    this.setState({returnAddress});
  }

  handleChange = (e, {value}) => {
    const fee = currency.convertCurrencyTo(value, 'satoshi', this.props.currency);
    const state = this.calculateFeeState(fee, this.state.returnAddress);
    this.setState({...state, totalFee: value});
    this.props.setReturnPayment(state.returnPayment);
  }

  calculateDefaultAddressState = (totalFee, presetPayment) => {
    let payments = this.props.payments;
    let balance = 0;
    if (presetPayment) {
      payments = [...payments, presetPayment]
      balance = presetPayment.amount;
    }
    const modTx = transaction.createSignedTransaction(
      this.props.contributions,
      payments,
      this.props.privKeysArg);
    const feeRate = Math.ceil(fees.getFeeRate(modTx, totalFee));
    return {
      size: modTx.getSize(),
      feeRate: feeRate,
      remainingBalance: balance,
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
        size: 0,
        feeRate: '',
        remainingBalance: 'ERROR',
        error: true,
        errorMessage: 'Total fee must be less than or equal to the available balance.',
        triggerAnimation: true,
        returnPayment: null,
      };
    }
    const newPayment = new models.Payment(returnAddress, balance);
    const payments = [...this.props.payments, newPayment];
    const modTx = transaction.createSignedTransaction(
      this.props.contributions,
      payments,
      this.props.privKeysArg);
    const feeRate = Math.ceil(fees.getFeeRate(modTx, value));
    // TODO the way that this handles returnPayment kinda sucks
    return {
      size: modTx.getSize(),
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

  setCurrency = (e, { value }) => {
    this.props.setCurrency(value);
  }

  render() {
    const feeRate = fees.formatSize(currency.convertCurrencyTo(this.state.feeRate, this.props.currency), this.state.sizeUnit);
    const remainingBalance = currency.convertCurrencyTo(this.state.remainingBalance, this.props.currency);
    const size = fees.formatSize(this.state.size, this.state.sizeUnit);
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto'}}>
        <div style={{flexGrow: '1', display: 'flex', background: lime, margin: '0.5rem 0.5rem 0 0.5rem', borderRadius: '0.5rem 0.5rem 0 0'}}>
          <img style={{flexGrow:1}} src={transferIcon} alt={'transferIcon'}/>
        </div>
        <div style={{display: 'flex', flexDirection:'column', background: lime, margin: '0 0.5rem 0.5rem 0.5rem', borderRadius: '0 0 0.5rem 0.5rem'}}>
          <div style={{fontSize: '2em', margin: '2rem 2rem 1rem 2rem', textAlign:'center'}}>Remaining Balance: {`${remainingBalance} ${this.props.currency}`}</div>
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
                     label={
                      <Dropdown options={currencyOptions}
                                onChange={this.setCurrency}
                                value={this.props.currency}
                                upward
                      />
                     }
                     labelPosition='right' type='number' min={0}
                     step={1}/>
            </div>
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Fee Rate</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem', width: '20rem'}}
                     value={feeRate}
                     disabled
                     label={
                      <Dropdown options={this.rateOptions}
                                onChange={this.changeSizeUnit}
                                value={this.state.sizeUnit}
                                upward/>}
                     labelPosition='right' type='number' min={0}/>
            </div>
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Size</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem', width: '20rem'}}
                     value={size}
                     disabled
                     label={
                      <Dropdown options={sizeOptions}
                                onChange={this.changeSizeUnit}
                                value={this.state.sizeUnit}
                                upward/>}
                     labelPosition='right' type='number' min={0}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeesFrame;
