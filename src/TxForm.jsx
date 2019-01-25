import React, { Component } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

class TxForm extends Component {
  state = {
    'transaction hash': '',
    'output index': '',
    'scriptPubKey': '',
    'recieving address': '',
    'payment amount': '',
    'private key': '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    this.props.callback(this.state);
  }

  render() {
    return(
      <Segment inverted>
        <Form inverted onSubmit={this.handleSubmit}>
          <Form.Group >
            <Form.Input fluid label='transaction hash'
                        placeholder='transaction hash' width={8}
                        name='transaction hash'
                        value={this.state['transaction hash']}
                        onChange={this.handleChange}
                        />
            <Form.Input fluid label='output index'
                        placeholder='output index' width={2}
                        name='output index'
                        value={this.state['output index']}
                        onChange={this.handleChange}
                        />
            <Form.Input fluid label='scriptPubKey'
                        placeholder='scriptPubKey' width={6} 
                        name='scriptPubKey'
                        value={this.state['scriptPubKey']}
                        onChange={this.handleChange}
                        />
          </Form.Group>
          <Form.Group >
            <Form.Input fluid label='recieving address' 
                        placeholder='recieving address' width={10}
                        name='recieving address'
                        value={this.state['recieving address']}
                        onChange={this.handleChange}
                        />
            <Form.Input fluid label='payment amount'
                        placeholder='payment amount' width={6}
                        name='payment amount'
                        value={this.state['payment amount']}
                        onChange={this.handleChange}
                        />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input fluid label='private key'
                        placeholder='private key'
                        name='private key'
                        value={this.state['private key']}
                        onChange={this.handleChange}
                        />
          </Form.Group>
          <Button type='submit'>Submit</Button>
        </Form>
      </Segment>
    )
  }
}
export default TxForm;
