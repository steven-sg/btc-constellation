import React, { Component } from 'react';
import GridInputForm from './grid_input_form';
import { Card } from 'semantic-ui-react'

class paymentInputFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getGroups = ()  => {
    return [[{
        label: 'Bitcoin Address',
        name: 'Bitcoin Address',
        placeholder: 'Bitcoin Address',
        width: 10,
      },
      {
        label: 'Amount',
        name: 'Amount',
        placeholder: 'Amount',
        width: 6,
      }]
    ]
  }
  render() {
    return (
      <Card style={{width: '100%'}}>
        <Card.Content>
          <GridInputForm groups={this.getGroups()} buttonText='Add Payment'/>
        </Card.Content>
      </Card>
    );
  }
}

export default paymentInputFrame;
