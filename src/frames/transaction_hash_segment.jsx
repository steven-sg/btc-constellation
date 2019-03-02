import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react'
import { utils } from 'easy_btc';

class TxHashSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get segmentedHash () {
    return utils.joinArray(this.props.transaction.transactionDict).array.join('');
  }
  render() {
    return (
      <Segment style={{overflow: 'auto', fontSize: '2.5em', padding: '1.5rem'}}>
          { this.segmentedHash }
      </Segment>
    );
  }
}

export default TxHashSegment;
