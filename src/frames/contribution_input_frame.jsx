import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import ContributionInputManualFrame from './contribution_input_manual_frame';

class ContributionInputFrame extends Component {

  render() {
    return (
      <div style={{margin: '0.5rem'}}>
        <Tab menu={{ pointing: true, attached: true}}
            panes={[{ menuItem: 'Automatic', render: () => <Tab.Pane> Under Development </Tab.Pane> },
                    { menuItem: 'Manual', render: () => <Tab.Pane><ContributionInputManualFrame callback={this.props.callback} currency={this.props.currency}/> </Tab.Pane> }]} />
      </div>
    );
  }
}

export default ContributionInputFrame;
