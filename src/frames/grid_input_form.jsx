import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

class GridInputForm extends Component {
  state = {}

  constructFormGroups = (data) => {
    return data.map((item) => <Form.Group>{this.constructFormInputs(item)}</Form.Group>);
  }

  constructFormInputs = (data) => {
    return data.map((item) => <Form.Input label={item.label} name={item.name} value={this.state[item.name]} onChange={this.handleChange} placeholder={item.placeholder} width={item.width}/>);
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  handleSubmit = () => {
    this.props.callback(this.state);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.constructFormGroups(this.props.groups)}
        <Form.Button content={this.props.buttonText} />
      </Form>
    );
  }
}

export default GridInputForm;
