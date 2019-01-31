import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import ContributionInputManualFrame from './contribution_input_manual_frame';

class ContributionInputFrame extends Component {

  render() {
    return (
      <Tab style={this.props.style} menu={{ borderless: true, attached: false, tabular: false }}
           panes={[{ menuItem: 'Automatic', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
                   { menuItem: 'Manual', render: () => <Tab.Pane><ContributionInputManualFrame callback={this.props.callback}/> </Tab.Pane> }]} />
    );
  }
}

export default ContributionInputFrame;
