import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react'
import { model, utils, services } from 'easy_btc';
import { OperationResult, ValidationError } from '../util';

class AutomaticContributionInputFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorList: [],
      'Bitcoin Address': '',
      'Bitcoin Address error': false,
      otherError: false,
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
          if (addressType !== 'P2PKH') {
            return new OperationResult(false, new Error(
              `Address type ${addressType} is not supported. Please supply a P2PKH address.`
            ));
          }
        } catch (error) {
          if (error instanceof utils.InvalidInputError) {
            return new OperationResult(false, new Error(
              `Unrecognised address format. Please supply a P2PKH address.`
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
              `This address belongs to an compatible network: ${network}.
              Please use an address from the ${expectedNetwork} or create a new ${network} transaction.`
            ));
          }
        } catch (error) {
          if (error instanceof utils.InvalidInputError) {
            return new OperationResult(false, new Error(
              `Unrecognised address network. Please supply a P2PKH address.`
            ));
          }
          return new OperationResult(false, new Error(
            `An unexpected error has occurred.`
          ));
        }

        return new OperationResult(true);
      default:
        return; // TODO should this throw an error?
    }
  }

  validateSubmission = () => {
    if (this.state['Bitcoin Address error'] || !this.state['Bitcoin Address']) {
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
    } else {
      services.pullUnspentTransactions(this.state["Bitcoin Address"], this.props.network)
      .then((response) => {
        const transaction = response.data;
        let splitTransactions = [];
        for (let index = 0; index < transaction.length; index++) {
          const outputs = transaction[index].outputs;
          const transactions = Object.keys(outputs).map(
            (key) => {
              const transactionOutput = [new model.transaction.TransactionOutput(
                outputs[key].outputIndex.toString(), outputs[key].scriptPubKey, outputs[key].balance)];
              const tx = new model.transaction.Transaction(transaction[index].txHash, transactionOutput);
              return tx;
            }
          );
          splitTransactions = splitTransactions.concat(transactions);
        }
        const submissionResult = this.props.addTransactions(splitTransactions);
        if (!submissionResult.success) {
          this.setState({otherError: submissionResult.error.message});
        }
      }).catch((error) => {
        if (error.status === 429) {
          this.setState({otherError: 'ERROR 429: Too Many Request. This request is being rate limited. Try again with a different input or use the manual input alternative.'});
        } else {
          const errMessage = error.message || `${error.status}`;
          this.setState({otherError: errMessage});
        }
      });
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

  render() {
    const otherError = this.state.otherError;
    const addressError = this.state['Bitcoin Address error'];
    const formError = addressError || (otherError && otherError.length > 0);
    return (
      <Form onSubmit={this.handleSubmit} error={formError} style={{margin: '0.5rem'}}>
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
                      placeholder='Bitcoin Address' width={16}
                      error={addressError}/>
        </Form.Group>
        <Form.Button content='Add Contribution' disabled={formError}/>
      </Form>
    );
  }
}

export default AutomaticContributionInputFrame;
