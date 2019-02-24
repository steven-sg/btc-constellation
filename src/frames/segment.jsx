import React, { Component } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { utils, dataStructures } from 'easy_btc';
import { PascalCase } from '../util';
import { GenericLog } from './segments';
import VisibilitySensor from 'react-visibility-sensor';
class ComplexSegmentGroup extends Component {
  state = {}
  createTitleSegment = (item, titleIndex) => {
    return (
      <Segment inverted style={{overflow: 'auto', marginTop: titleIndex ? '1rem' : 0, fontStyle: 'bold'}} key={item} color='yellow'>
          <Header as='h4'>{ PascalCase(item) }</Header>
      </Segment>
    );
  }

  createSegment = (item, key, index) => {
    if (utils.isIterable(item)) {
      const firstItem = item[0];
      const tailItems = [...item].splice(1);
      const firstSegment = this.createSegment(firstItem, key, index + 1);
      return [firstSegment].concat(this.createSubSegments(tailItems, key, index + 1));
    } else if (item instanceof dataStructures.OrderedDict) {
      const items = item.getKeys().map((key, subIndex) => {
        return this.createSegment(item.getValue(key), key, `${index}.${subIndex}`);
      });
      return items;
    }
    return (
      <VisibilitySensor key={`${key}.${index}.${item.log}`}>  
        {({isVisible}) => {
          return (
            <Segment style={{overflow: 'auto', wordBreak: 'break-all'}}>
              <GenericLog log={item} showResult/>
            </Segment>
          )}
        }
      </VisibilitySensor>
    );
  };

  createSubSegments = (items, key, subIndex) => {
    const subSegments = items.map((item, i) => {
      if (item.hasSubaction && item.hasSubaction()) {
        return item.subaction.map((subaction) => {
          return(
            <div key={`${key}.${subIndex}.${i}.${item.log}`} style={{display: 'flex'}}>
              <div style={{backgroundColor: 'grey', minWidth:'20px'}} />
              <Segment style={{overflow: 'auto', marginTop:'0', flexGrow:'1', borderBottom:'none', borderRadius:'0', wordBreak: 'break-all'}}>
                <GenericLog log={subaction} showResult/>
              </Segment>
            </div>
          );
        })
      }
      return (
        <div key={`${key}.${subIndex}.${i}.${item.log}`} style={{display: 'flex'}}>
          <div style={{backgroundColor: 'grey', minWidth:'10px'}} />
          <Segment style={{overflow: 'auto', marginTop:'0', flexGrow:'1', borderBottom:'none', borderRadius:'0', wordBreak: 'break-all'}}>
            <GenericLog log={item} showResult/>
          </Segment>
        </div>
      );
    });
  
    return subSegments;
  };

  render() {
    let { transaction } = this.props;
    return (
      <div style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll', margin:'0.5rem', paddingRight:'0.5rem'}}>
        { transaction.logger.getKeys().map((key, i) =>
          {
            return (
              <div key={key}>
                <Segment.Group>
                  { this.createTitleSegment(key, i) }
                  { transaction.logger.getValue(key).map((log, index) => this.createSegment(log, key, index)) }
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
