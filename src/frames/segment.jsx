import React, { Component } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { utils } from 'easy_btc';
import { PascalCase } from '../util';
import VisibilitySensor from 'react-visibility-sensor';
class ComplexSegmentGroup extends Component {
  state = {}

  createTitleSegment = (item, titleIndex) => {
    return (
      <Segment inverted style={{overflow: 'auto', marginTop: titleIndex ? '1rem' : 0, fontStyle: 'bold'}} key={item} color='yellow'>
          <Header as='h3'>{ PascalCase(item) }</Header>
      </Segment>
    );
  }

  createSegment = (item, index=0) => {
    if (utils.isIterable(item)) {
      const firstItem = item[0];
      const tailItems = [...item].splice(1);
      const firstSegment = this.createSegment(firstItem);
      return [firstSegment].concat(this.createSubSegments(tailItems));
    }
    return (
      <VisibilitySensor>
        {({isVisible}) => {
          return (
            <Segment style={{overflow: 'auto'}} key={item} >
              { item }
            </Segment>
          )}
        }
      </VisibilitySensor>
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

  // render() {
  //   let { items } = this.props;
  //   return (
  //     <div ref={this.handleContextRef} style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll', margin:'0.5rem', paddingRight:'0.5rem'}}>
  //       <Segment.Group >
  //           { items.map((item, i) => this.createSegment(item, i)) }
  //       </Segment.Group>
  //     </div>
  //   );
  // }
  render() {
    let { items, transaction } = this.props;
    return (
      <div ref={this.handleContextRef} style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll', margin:'0.5rem', paddingRight:'0.5rem'}}>
        { transaction.logger.getKeys().map((key, i) =>
          {
            return (
              <div>
                {/* <Segment style={{marginTop: i? '1rem': 0}}>{PascalCase(key)}</Segment> */}
                <Segment.Group>
                  { this.createTitleSegment(key, i) }
                  { utils.joinArray(transaction.logger.getValue(key)).array.map((array, i) => this.createSegment(array, i)) }
                </Segment.Group>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default ComplexSegmentGroup
