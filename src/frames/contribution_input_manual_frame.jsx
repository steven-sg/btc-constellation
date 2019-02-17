import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react'
import { model, unloggedUtils } from 'easy_btc';
import { OperationResult, ValidationError } from '../util';
class ContributionInputManualFrame extends Component {
  constructor (props) {
    super(props);
    const state = {
      errorList: [],
      'Transaction Hash error': false,
      'Output Index error': false,
      'ScriptPubKey error': false,
      'balance error': false,
      otherError: false,
    };
    const formValues = this.getInitialFormValues(this.props.tutorial);
    this.state = {...state, ...formValues} 
  }

  componentDidUpdate(prevProps) {
    // If a contribution has been removed from the list
    if (prevProps.contributions.length !== this.props.contributions.length) {
      this.setState({otherError: false});
    }
  }

  getInitialFormValues = (prefill) => {
    if (prefill) {
      return {
        'Transaction Hash': '68e7da9216d4e113df7918383258f7cec0a5cf661f469f68966aadf6a12358d3',
        'Output Index': '0',
        'ScriptPubKey': '76a914328dbf4cbeacc2898f096ffce5f9dcd27b53e5cc88ac',
        'Balance': '20000000',
      };
    }
    return {
      'Transaction Hash': '',
      'Output Index': '',
      'ScriptPubKey': '',
      'Balance': '',
    }
  }

  validate = (name, value) => {
    switch (name) {
      case 'Transaction Hash':
        // TODO find transcaction length and acceptable characters (hex?)
        return new OperationResult(true);
      case 'Output Index':
        return new OperationResult(true);
      case 'ScriptPubKey':
        try {
          value.length && unloggedUtils.getScriptFormat(value);
          return new OperationResult(true);
        } catch (error) {
          // TODO add generic error
          return new OperationResult(false, error);
        }
      case 'Balance':
        return new OperationResult(true);
      default:
        return; // TODO should this throw an error?
    }
  }

  validateSubmission = () => {
    if (this.state['Transaction Hash error']
           || this.state['Output Index error']
           || this.state['ScriptPubKey error']
           || this.state['balance error']
           || !this.state['Transaction Hash'] || !this.state['Transaction Hash'].length
           || !this.state['Output Index'] || !this.state['Output Index'].length
           || !this.state['ScriptPubKey'] || !this.state['ScriptPubKey'].length) {
      return new OperationResult(false, new ValidationError('Please ensure that all required fields are filled.'));
    }
    return new OperationResult(true);
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
    const balance = this.state['Balance'] && this.state['Balance'].length ? unloggedUtils.convertCurrencyTo(this.state['Balance'], 'satoshi', this.props.currency)
                                                                          : null;
    const transactionOutput = [new model.transaction.TransactionOutput(Number(this.state['Output Index']).toString(), this.state['ScriptPubKey'], balance)];
    const tx = new model.transaction.Transaction(this.state['Transaction Hash'], transactionOutput);
    const submissionResult = this.props.callback(tx);
    if (!submissionResult.success) {
      this.setState({otherError: submissionResult.error.message});
    }
  }

  get balanceStepSize () {
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

  render() {
    const otherError = this.state.otherError;
    const transactionError = this.state['Transaction Hash error'];
    const outputIndexError = this.state['Output Index error'];
    const scriptPubKeyError = this.state['ScriptPubKey error'];
    const balanceError = this.state['balance error'];
    const formError = transactionError || outputIndexError || scriptPubKeyError || balanceError || (otherError && otherError.length > 0);
    return (
      <Form onSubmit={this.handleSubmit} error={formError} style={{margin: '0'}}>
          <Message
            error
            header='Invalid Input'
            content={
              <p style={{overflowWrap: 'break-word'}}>
                {otherError || (this.state.errorList.length && this.state.errorList[0].message)}
              </p>}
          />
        <Form.Group>
          <Form.Input style={{marginBottom: '1rem'}}
                      label='Transaction Hash'
                      name='Transaction Hash'
                      value={this.state['Transaction Hash']}
                      onChange={this.handleChange}
                      placeholder='Transaction Hash' width={10}
                      error={transactionError}/>
          <Form.Input style={{marginBottom: '1rem'}}
                      label='Output Index'
                      name='Output Index'
                      value={this.state['Output Index']}
                      onChange={this.handleChange}
                      placeholder='Output Index' width={6}
                      type='number' min={0}
                      error={outputIndexError}/>
        </Form.Group>
        <Form.Group>
          <Form.Input style={{marginBottom: '1rem'}}
                      label='ScriptPubKey'
                      name='ScriptPubKey'
                      value={this.state['ScriptPubKey']}
                      onChange={this.handleChange}
                      placeholder='ScriptPubKey' width={10}
                      error={scriptPubKeyError}/>
          <Form.Input style={{marginBottom: '1rem'}}
                      label='Balance (optional)'
                      name='Balance'
                      value={this.state['Balance']}
                      onChange={this.handleChange}
                      placeholder={`Balance (${this.props.currency})`} width={6}
                      type='number' min={0}
                      error={balanceError}
                      step={this.balanceStepSize}/>
        </Form.Group>
        <Form.Button content='Add Contribution' disabled={formError}/>
      </Form>
    );
  }
}

export default ContributionInputManualFrame;
