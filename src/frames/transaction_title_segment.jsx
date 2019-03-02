import React, { Component }from 'react';
import { Segment, Header } from 'semantic-ui-react'
import Snapshot from './transaction_snapshot';
import { PascalCase } from '../util';

class TransactionTitleSegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      showSnapshot: false,
    };
  }

  handleHoverOver = () => {
    this.setState({hover: true});
  }

  handleHoverExit = () => {
    this.setState({hover: false});
  }

  handleClick = () => {
    this.setState({showSnapshot: !this.state.showSnapshot});
  }

  renderSnapshot () {
    if (this.state.showSnapshot) {
      return (
        <Snapshot snapshot={this.props.snapshot}/>
      );
    }
  }
  render() {
    return (
      <Segment inverted style={{overflow: 'auto', fontStyle: 'bold'}}
               color='teal'
               tertiary={this.state.hover}
               onMouseOver={this.handleHoverOver}
               onMouseLeave={this.handleHoverExit}
               onClick={this.handleClick}>
          <Header as='h4'>{ PascalCase(this.props.item) }</Header>
          {this.renderSnapshot()} 
      </Segment>
    );
  }
}

export default TransactionTitleSegment;