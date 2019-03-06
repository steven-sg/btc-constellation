import React, { Component } from 'react';
import { Card, Form, Message } from 'semantic-ui-react'
import { model, unloggedUtils, utils } from 'easy_btc';
import { OperationResult, ValidationError, getCurrencyStepSize } from '../util';

class paymentInputFrame extends Component {
  constructor(props) {
    super(props);
    const state = {
      errorList: [],
      'Amount error': false,
      'Bitcoin Address error': false,
      otherError: false,
    };
    const formValues = this.getInitialFormValues(this.props.tutorial);
    this.state = {...state, ...formValues}
  }

  getInitialFormValues = (prefill) => {
    if (prefill) {
      return {
        'Bitcoin Address': 'mjUDEsMXuYFZSrERVZjzHpznNJFzNUBoop',
        'Amount': '10000000',
      };
    }
    return {
      'Bitcoin Address': '',
      'Amount': '',
    };
  }

  validate = (name, value) => {
    switch (name) {
      case 'Bitcoin Address':
        if (!value.length) {
          return new OperationResult(true);
        }

        try {
          const addressType = utils.getAddressFormat(value).toUpperCase();
          if (addressType !== 'P2PKH' && addressType !== 'P2SH') {
            return new OperationResult(false, new Error(
              `Address type ${addressType} is not supported. Please supply a P2PKH/P2SH address.`
            ));
          }
        } catch (error) {
          if (error instanceof utils.InvalidInputFormat) {
            return new OperationResult(false, new Error(
              `Unrecognised address format. Please supply a P2PKH/P2SH address.`
            ));
          }
          return new OperationResult(false, new Error(
            `An unexpected error has occurred.`
          ));
        }

        try {
          const network = utils.getAddressNetwork(value).toUpperCase();
          const expectedNetwork = this.props.network.toUpperCase();
          if (network !== expectedNetwork) {
            return new OperationResult(false, new Error(
              `This address belongs to an incompatible network: ${network}.
              Please use an address from the ${expectedNetwork} or create a new ${network} transaction.`
            ));
          }
        } catch (error) {
          if (error instanceof utils.InvalidInputFormat) {
            return new OperationResult(false, new Error(
              `Unrecognised address network. Please supply a P2PKH/P2SH address.`
            ));
          }
          return new OperationResult(false, new Error(
            `An unexpected error has occurred.`
          ));
        }

        return new OperationResult(true);
      case 'Amount':
        return new OperationResult(true);
      default:
        return; // TODO should this throw an error?
    }
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
    const payment = new model.transaction.Payment(this.state['Bitcoin Address'], amount);
    const result = this.props.callback(payment);
    if (!result.success) {
      this.setState({otherError: result.error.message});
    }
  }

  appendError = (errorList, name, error) => {
    // TODO Modularize this in an util
    let errorListCopy = errorList.slice(0);
    let found = false;
    errorListCopy.forEach((element, index) => {
      if (!found && element.field === name) {
        errorListCopy[index].message = error.message;
        found = true;
      }
    });
    if (!found) {
      errorListCopy.push({
        field: name,
        message: error.message,
      });
    }
    return errorListCopy;
  };

  removeError = (errorList, name) => {
    // TODO Modularize this in an util
    return errorList.filter((element) => {
      return element.field !== name;
    });
  }

  get stepSize () {
    return getCurrencyStepSize(this.props.currency.toLowerCase());
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
                            error={amountError}
                            step={this.stepSize}/>
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
