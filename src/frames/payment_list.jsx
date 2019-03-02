import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector';
import { unloggedUtils } from 'easy_btc';

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (e, {address, amount}) => {
    this.props.callback(address, amount);
  }

  convertAmount = (amount) => {
    return unloggedUtils.convertCurrencyTo(amount, this.props.currency);
  }

  renderSegments = () => {
    let segments = this.props.payments.map((payment, index) => {
      return (
        <Segment style={{display: 'flex', alignItems: 'center'}} key={index}>
          <Button style={{boxShadow: 'noneƒ', marginRight: '1rem'}} basic size='small' icon='times' onClick={this.handleClick} address={payment.to} amount={payment.amount}/>
          <p style={{display: 'inline', flexGrow: 1, marginBottom: '0', marginRight: '1rem', overflowX: 'auto'}}>{payment.to}</p>
          <p style={{display: 'inline', overflowX: 'auto'}}>{`${this.convertAmount(payment.amount)} ${this.props.currency}`}</p>
        </Segment>
      )
    });
    return segments;
  }

  render() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 1, flexGrow: 1, overflowY:'scroll', overflowX:'auto', paddingRight: '0.5rem', margin:'0.5rem'}}>
          <Segment.Group style={{margin: 0}}>
            {this.renderSegments()}
          </Segment.Group>
          <div style={{flexGrow: 1, flexShrink: 0, display:'flex'}}>
            <ReactResizeDetector handleHeight >
              {
                (width, height) => {
                  if (height < 70) {
                    return <div />;
                  }
                  return (
                    <div style={{flexGrow: 1, flexShrink: 0, borderStyle:'dashed', borderRadius: '20px', borderWidth: '0.25rem', borderColor: 'white', color: 'white', textAlign: 'center', display:'flex', alignItems:'center', justifyContent:'center', marginTop: this.props.payments.length? '0.5rem': 0}}>
                      <div style={{color: 'white'}}>Add Payments</div>
                    </div>
                  );
                }
              }
            </ReactResizeDetector>
          </div>
        </div>
    );
  }
}

export default PaymentList;
