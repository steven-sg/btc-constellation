import React, { Component } from 'react';
import { lightLime, lime, darkLime } from '../style/colors';
import { Button, Segment, Input } from 'semantic-ui-react'
import AddressList from './fees_address_list';
import transferIcon from '../icons/bitcoin-transfer.svg';
import AddressDropdown from './address_dropdown';
import { fees, transaction, model } from 'easy_btc';

class FeesFrame extends Component {
  constructor(props) {
    super(props);
    const modTx = transaction.createSignedTransaction(
      this.props.contributions,
      this.props.payments,
      this.props.privKeysArg);
    const feeRate = fees.getFeeRate(modTx, this.props.balance);
    this.state = {
      returnAddress: '',
      calculationType: 'automatic',
      totalFee: this.props.balance,
      feeRate: feeRate,
      remainingBalance: 0,
    };
  }
  
  setCalculationType = (calculationType) => {
    this.setState({calculationType});
  }

  handleClick = (e, {value}) => {
    this.setCalculationType(value);
  }

  handleChange(e, {name, value}) {
    if (this.state.calculationType === 'automatic') {
      const change = fees.calculateChangeByRatePayment(
        this.props.balance,
        value,
        this.state.returnAddress,
        this.props.contributions,
        this.props.payments,
        this.props.privKeysArg,
      );
      const payments = this.props.payments.concat(change);
      const modTx = transaction.createSignedTransaction(
        this.props.contributions,
        payments,
        this.props.privKeysArg);
      const totalFee = fees.getTotalFees(modTx, value);
      this.setState({
        totalFee,
        feeRate: value,
        remainingBalance: change.amount,
      });
    } else {
      const balance = this.props.balance - value;
      const payments = this.props.payments.concat(
        new model.transaction.Payment(this.state.returnAddress, balance));
      const modTx = transaction.createSignedTransaction(
        this.props.contributions,
        payments,
        this.props.privKeysArg);
      const feeRate = fees.getFeeRate(modTx, value);
      this.setState({
        totalFee: value,
        feeRate,
        remainingBalance: balance,
      });
    }
  }

  render() {
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto'}}>
        <div style={{flexGrow: '1', display: 'flex', background: lime, margin: '0.5rem 0.5rem 0 0.5rem', borderRadius: '0.5rem 0.5rem 0 0'}}>
          <img style={{flexGrow:1}} src={transferIcon} alt={'transferIcon'}/>
        </div>
        <div style={{display: 'flex', flexDirection:'column', background: lime, margin: '0 0.5rem 0.5rem 0.5rem', borderRadius: '0 0 0.5rem 0.5rem'}}>
          <div style={{fontSize: '2em', margin: '2rem 2rem 1rem 2rem', textAlign:'center'}}>Remaining Balance: {this.state.remainingBalance} btc</div>
          <div style={{display: 'flex', margin:'1rem 2rem 2rem 2rem'}}>
            <AddressDropdown/>
          </div>
          <div style={{display: 'flex'}}>
            <Button style={{flexGrow: '1', borderRadius: 0, margin: 0, background: this.state.calculationType === 'automatic' ? lightLime : lime}} value='automatic' onClick={this.handleClick}>Automatic</Button>
            <Button style={{flexGrow: '1', borderRadius: 0, margin: 0, background: this.state.calculationType === 'manual' ? lightLime : lime}} value='manual' onClick={this.handleClick}>Manual</Button>
          </div>
          <div style={{display: 'flex', flexDirection:'column', padding:'2rem 1rem 1rem 1rem', background:lightLime, borderRadius: ' 0 0 0.5rem 0.5rem'}}>
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Total Fees</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem'}}
                     value={this.state.totalFee}
                     onChange={this.handleChange}
                     disabled={!this.state.returnAddress.length || this.state.calculationType !== 'manual'}
                     />
            </div>
            <div style={{display: 'flex', justifyContent:'space-evenly'}}>
              <div style={{margin: 'auto 0.5rem', width: '10rem'}}>Fee Rate</div>
              <Input style={{flexGrow:'0.3', margin:'0.5rem'}}
                     value={this.state.feeRate}
                     onChange={this.handleChange}
                     disabled={!this.state.returnAddress.length || this.state.calculationType !== 'automatic'}
                     />
            </div>
          </div>
        </div>
        <div style={{flexGrow: '1'}}></div>
        {/* <Segment>Address</Segment> */}
        {/* <AddressList callback={this.props.callback} addresses={this.props.addresses}></AddressList> */}
      </div>
    );
  }
}

export default FeesFrame;
