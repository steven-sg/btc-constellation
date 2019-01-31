import React, { Component } from 'react';
import GridInputForm from './grid_input_form';
import { Card } from 'semantic-ui-react'
import { transaction } from 'easy_btc';

const groups = [[{
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
  ];

class paymentInputFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callback = (state) => {
    const payment = new transaction.Payment(state['Bitcoin Address'], state.Amount);
    this.props.callback(payment);
  }

  render() {
    return (
      <Card style={{width: '100%'}}>
        <Card.Content>
          <GridInputForm groups={groups} buttonText='Add Payment' callback={this.callback}/>
        </Card.Content>
      </Card>
    );
  }
}

export default paymentInputFrame;
