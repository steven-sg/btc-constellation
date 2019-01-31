import React, { Component } from 'react';
import { List } from 'semantic-ui-react'
import { Segment, Button } from 'semantic-ui-react'

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSegments = () => {
    let segments = this.props.payments.map(payment => {
      return (
        <Segment style={{display: 'flex', alignItems: 'center'}}>
          <Button style={{boxShadow: 'noneƒ'}} basic transparent size='small' icon='times' />
          <p style={{display: 'inline', flexGrow: 1, marginBottom: '0'}}>{payment.to}</p>
          <p style={{display: 'inline'}}>{`${payment.amount} mBTC`}</p>
        </Segment>
      )
    });
    return segments;
  }

  render() {
    return (
        <List style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll'}}>
          <Segment.Group>
            {this.renderSegments()}
          </Segment.Group>
        </List>
    );
  }
}

export default PaymentList;
