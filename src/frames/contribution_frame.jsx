import React, { Component } from 'react';
import ContributionInputFrame from './contribution_input_frame';
import ContributionList from './contribution_list';
import BalanceSegment from './balance_segment';

class ContributionFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {txs: []};
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
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column'}}>
        <div style={{overflowY: 'scroll', flexGrow: 1, display: 'flex', flexDirection: 'column', margin: '0.5rem 0.5rem 0 0'}}>
          <ContributionInputFrame addTransactions={this.props.addTransactions} currency={this.props.currency} contributions={contributions} tutorial={this.props.tutorial} network={this.props.network}/>
          <ContributionList contributions={contributions} callback={this.props.removeTransaction} currency={this.props.currency}/>
        </div>
        <BalanceSegment balance={this.props.balance} currency={this.props.currency} callback={this.props.setCurrency} upward={true}/>
      </div>
    );
  }
}

export default ContributionFrame;
