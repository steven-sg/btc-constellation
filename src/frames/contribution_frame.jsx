import React, { Component } from 'react';
import ContributionInputFrame from './contribution_input_frame';
import ContributionList from './contribution_list';
import BalanceSegment from './balance_segment';

class ContributionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {txs: []}
  }

  appendToTransaction = (tx) => {
    let txs = this.state['txs'].slice(0);
    txs.push(tx);
    this.setState({txs});
  }

  getContributions = () => {
    let contributions = [];
    this.state['txs'].forEach(tx => contributions = contributions.concat(tx.getContributions()));
    return contributions;
  }

  render() {
    const contributions = this.props.contributions;
    const balance = contributions.reduce((sum, a) => sum + Number(a.output.balance), 0);
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column'}}>
        <ContributionInputFrame callback={this.props.addTransaction} currency={this.props.currency}/>
        <ContributionList contributions={contributions} callback={this.props.removeTransaction} currency={this.props.currency}/>
        <BalanceSegment balance={balance} currency={this.props.currency} callback={this.props.setCurrency}/>
      </div>
    );
  }
}

export default ContributionFrame;
