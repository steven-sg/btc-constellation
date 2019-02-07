import React, { Component } from 'react';
import { Card, Form, Message } from 'semantic-ui-react'
import { transaction, unloggedUtils } from 'easy_btc';
import { OperationResult, ValidationError } from '../util';

class paymentInputFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorList: [],
      'Bitcoin Address error': false,
      'Amount error': false,
      'Bitcoin Address': '',
      'Amount': '',
      otherError: false,
    };
  }

  validate = (name, value) => {
    switch (name) {
      case 'Bitcoin Address':
        return new OperationResult(true);
      case 'Amount':
        return new OperationResult(true);
      default:
        return; // TODO should this throw an error?
    }
  }

  get amountStepSize () {
    switch(this.props.currency.toLowerCase()) {
      case 'btc':
        return 0.00000001;
      case 'mbtc':
        return 0.00001;
      case 'satoshi':
        return 1;
      default:
        return 1;
    }
  }

  removeError = (errorList, name) => {
    return errorList.filter((element) => {
      return element.field !== name;
    });
  }

  validateSubmission = () => {
    if (this.state['Bitcoin Address error']
           || this.state['Amount error']
           || !this.state['Bitcoin Address'] || !this.state['Bitcoin Address'].length
           || !this.state['Amount'] || !this.state['Amount'].length) {
      return new OperationResult(false, new ValidationError('Please ensure that all required fields are filled.'));
    }
    return new OperationResult(true);
  }

  handleChange = (e, { name, value }) => {
    const { success, error } = this.validate(name, value);
    const errorProperty = `${name} error`;
    const errorList = success? this.removeError(this.state.errorList, name): this.appendError(this.state.errorList, name, error);

    const newState = {
      [name]: value,
      [errorProperty]: !success,
      otherError: false,
      errorList,
    };
    this.setState(newState);
  }

  handleSubmit = () => {
    const { success, error } = this.validateSubmission();
    if (!success) {
      this.setState({otherError: error.message});
      return
    }
    const amount = unloggedUtils.convertCurrencyTo(this.state['Amount'], 'satoshi', this.props.currency);
    const payment = new transaction.Payment(this.state['Bitcoin Address'], amount);
    this.props.callback(payment);
  }

  render() {
    const otherError = this.state.otherError;
    const addressError = this.state['Bitcoin Address error'];
    const amountError = this.state['Amount error'];
    const formError = addressError || amountError || (otherError && otherError.length > 0);
    return (
      <div style={{margin: '0.5rem'}}>
        <Card style={{width: '100%'}}>
          <Card.Content>
            <Form onSubmit={this.handleSubmit} error={formError} style={{margin: '0'}}>
              <Message
                error
                header='Invalid Input'
                content={
                  <p style={{overflowWrap: 'break-word'}}>
                    {otherError || (this.state.errorList.length && this.state.errorList[0].message)}
                  </p>
                }
              />
              <Form.Group>
                <Form.Input style={{marginBottom: '1rem'}}
                            label='Bitcoin Address'
                            name='Bitcoin Address'
                            value={this.state['Bitcoin Address']}
                            onChange={this.handleChange}
                            placeholder='Bitcoin Address' width={10}
                            error={addressError}/>
                <Form.Input style={{marginBottom: '1rem'}}
                            label='Amount'
                            name='Amount'
                            value={this.state['Amount']}
                            onChange={this.handleChange}
                            placeholder='Amount' width={6}
                            type='number' min={0}
                            error={amountError}/>
              </Form.Group>
              <Form.Button content='Add Payment' disabled={formError}/>
            </Form>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

export default paymentInputFrame;
