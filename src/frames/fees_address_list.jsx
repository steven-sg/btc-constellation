import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react'

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (e, {address}) => {
    this.props.callback(address);
  }

  renderSegments = () => {
    let segments = this.props.addresses.map((address, index) => {
      return (
        <Segment style={{display: 'flex', alignItems: 'center'}} key={index}>
          <Button style={{boxShadow: 'noneƒ', marginRight: '1rem'}} basic size='small' icon='times' onClick={this.handleClick} address={address}/>
          <p style={{display: 'inline', flexGrow: 1, marginBottom: '0', marginRight: '1rem', overflowX: 'auto'}}>{address}</p>
        </Segment>
      )
    });
    return segments;
  }

  render() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 1, flexGrow: 1, overflowY:'scroll', overflowX:'auto', paddingRight: '0.5rem', margin:'0.5rem'}}>
          <Segment.Group style={{margin: 0}}>
            {this.renderSegments()}
          </Segment.Group>
        </div>
    );
  }
}

export default PaymentList;
