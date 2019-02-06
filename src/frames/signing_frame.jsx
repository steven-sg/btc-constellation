import React, { Component } from 'react';
import { Form, Segment } from 'semantic-ui-react'

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
    return (
      <div style={{width:'100%', flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'scroll'}}>
        {this.props.transactions.map((tx) => <SigningForm address={tx.txHash} value={this.state[tx.txHash]} onChange={this.handleChange} callback={this.handleSubmit}/>)}
      </div>
    );
  }
}

export default SigningFrame;
