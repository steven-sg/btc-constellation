import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import ContributionInputManualFrame from './contribution_input_manual_frame';
import ContributionAutomaticInputFrame from './contribution_automatic_input_frame';
// TODO change the name ^

class ContributionInputFrame extends Component {

  render() {
    return (
      <div style={{margin: '0.5rem'}}>
        <Tab menu={{ pointing: true, attached: true}}
             defaultActiveIndex={this.props.tutorial ? 1 : 0}
             panes={[{ menuItem: 'Automatic', render: () => (
                      <Tab.Pane>
                        <ContributionAutomaticInputFrame network={this.props.network}
                                                         addTransactions={this.props.addTransactions}/>
                      </Tab.Pane>)},
                     { menuItem: 'Manual', render: () => (
                      <Tab.Pane>
                        <ContributionInputManualFrame addTransactions={this.props.addTransactions}
                                                      currency={this.props.currency}
                                                      contributions={this.props.contributions}
                                                      tutorial={this.props.tutorial}/>
                      </Tab.Pane>)}]}/>
      </div>
    );
  }
}

export default ContributionInputFrame;
