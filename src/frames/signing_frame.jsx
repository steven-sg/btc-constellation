import React, { Component } from 'react';
import { Form, Segment } from 'semantic-ui-react'
import { transaction, utils } from 'easy_btc';

const SigningForm = ({address, value, onChange, callback}) => {
  const handleSubmit = () => {
    return callback(address);
  }
  return (
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Input label={address} name={address} value={value} onChange={onChange} />
        <Form.Button content={'Sign'} />
      </Form>
    </Segment>
  );
}

class SigningFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (address) => {
    this.props.callback(address, this.state[address]);
  }

  render() {
    // const transactionOutputs = [new transaction.TransactionOutput(1, '76a914c39a5a43ed93a4ee3066ac7a7f4fd1b36230f88588ac')];
    // const trans = new transaction.Transaction('53c634b26689010ed9ea6e6b80b04cb98f05b99e1060e6399e690b379bcec4c5', transactionOutputs);
    // const trans2 = new transaction.Transaction('53c634b26689010ed9ea6e6b80b04cb98f05b99e1060e6399e690b379bcec4c', transactionOutputs);
    // const transactions = [trans, trans2];
    return (
      <div style={{width:'100%', flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'scroll'}}>
        {this.props.transactions.map((tx) => <SigningForm address={tx.txHash} value={this.state[tx.txHash]} onChange={this.handleChange} callback={this.handleSubmit}/>)}
      </div>
    );
  }
}

export default SigningFrame;
