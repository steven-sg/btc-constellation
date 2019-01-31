import React, { Component } from 'react';
import { List } from 'semantic-ui-react'
import { Segment, Button } from 'semantic-ui-react'

class ContributionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSegments = () => {
    let segments = this.props.contributions.map(contribution => {
      return (
        <Segment style={{display: 'flex', alignItems: 'center'}}>
          <Button style={{boxShadow: 'noneƒ'}} basic transparent size='small' icon='times' />
          <p style={{display: 'inline', flexGrow: 1, marginBottom: '0'}}>{`${contribution.txHash}:${contribution.output.outputIndex}`}</p>
          <p style={{display: 'inline'}}>{`${contribution.output.balance} mBTC`}</p>
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

export default ContributionList;
