import React, { Component } from 'react';
import ContributionInputFrame from './contribution_input_frame';
import List from './list';
import BalanceSegment from './balance_segment';

class ContributionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {transaction: null}
  }

  appendToTransaction = (txs) => {
    alert(JSON.stringify(txs));
  }

  render() {
    return (
      <div style={{width:'100%', flexGrow: '1', display: 'flex', flexDirection:'column'}}>
        <ContributionInputFrame style={{flexBasis: 0}} callback={this.appendToTransaction}/>
        <List />
        <BalanceSegment />
      </div>
    );
  }
}

export default ContributionFrame;
