import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import { transaction, unloggedUtils } from 'easy_btc';

class ContributionInputManualFrame extends Component {

  state = {}

  get groups () {
    return [[{
        label: 'Transaction Hash',
        name: 'Transaction Hash',
        placeholder: 'Transaction Hash',
        width: 10,
      },
      {
        label: 'Output Index',
        name: 'Output Index',
        placeholder: 'Output Index',
        width: 6,
      }],
      [{
        label: 'ScriptPubKey',
        name: 'ScriptPubKey',
        placeholder: 'ScriptPubKey',
        width: 10,
      },
      {
        label: 'Balance',
        name: 'Balance',
        placeholder: `Balance (${this.props.currency})`,
        width: 6,
      }]
    ]
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  handleSubmit = () => {
    const balance = unloggedUtils.convertCurrencyTo(this.state['Balance'], 'satoshi', this.props.currency);
    const transactionOutput = [new transaction.TransactionOutput(this.state['Output Index'], this.state['ScriptPubKey'], balance)];
    const tx = new transaction.Transaction(this.state['Transaction Hash'], transactionOutput);
    this.props.callback(tx);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Input label='Transaction Hash'
                      name='Transaction Hash'
                      value={this.state['Transaction Hash']}
                      onChange={this.handleChange}
                      placeholder='Transaction Hash' width={10}/>
          <Form.Input label='Output Index'
                      name='Output Index'
                      value={this.state['Output Index']}
                      onChange={this.handleChange}
                      placeholder='Output Index' width={6}/>
        </Form.Group>
        <Form.Group>
          <Form.Input label='ScriptPubKey'
                      name='ScriptPubKey'
                      value={this.state['ScriptPubKey']}
                      onChange={this.handleChange}
                      placeholder='ScriptPubKey'
                      width={10}/>
          <Form.Input label='Balance'
                      name='Balance'
                      value={this.state['Balance']}
                      onChange={this.handleChange}
                      placeholder={`Balance (${this.props.currency})`}
                      width={6}/>
        </Form.Group>
        <Form.Button content='Add Fund' />
      </Form>
    );
  }
}

export default ContributionInputManualFrame;
