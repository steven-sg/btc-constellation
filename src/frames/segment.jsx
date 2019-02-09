import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { utils } from 'easy_btc';

class ComplexSegmentGroup extends Component {
  state = {}

  createSegment = (item, index=0) => {
    if (utils.isIterable(item)) {
      const firstItem = item[0];
      const tailItems = [...item].splice(1);
      const firstSegment = this.createSegment(firstItem);
      return [firstSegment].concat(this.createSubSegments(tailItems));
    }
    return (
      <Segment style={{overflow: 'auto'}} key={item} >
        { item }
      </Segment>
    );
  };

  createSubSegments = (items) => {
    const subSegments = items.map((item, i) => (
      <div key={item} style={{display: 'flex'}}>
        <div style={{backgroundColor: 'grey', minWidth:'10px'}} />
        <Segment style={{overflow: 'auto', marginTop:'0', flexGrow:'1', borderBottom:'none', borderRadius:'0'}} >{ item }</Segment>
      </div>));
  
    return subSegments;
  };

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    let { items } = this.props;
    return (
      <div ref={this.handleContextRef} style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll', margin:'0.5rem', paddingRight:'0.5rem'}}>
        <Segment.Group >
            { items.map((item, i) => this.createSegment(item, i)) }
        </Segment.Group>
      </div>
    );
  }
}

export default ComplexSegmentGroup
