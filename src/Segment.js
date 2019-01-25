import React from 'react'
import { Segment } from 'semantic-ui-react'
import { utils } from 'easy_btc';

const ComplexSegmentGroup = ({items}) => {
  const createSegment = (item, index=0) => {
    console.log('segment', item);
    if (utils.isIterable(item)) {
      const firstItem = item[0];
      const tailItems = [...item].splice(1);
      return [
        createSegment(firstItem),
        createSegmentSubGroup(tailItems),
      ];
    }
    return (
      <Segment style={{overflow: 'auto'}} key={index} >
        { item }
      </Segment>
    );
  };

  const createSegmentSubGroup = (items) => {
    console.log('groups', items);
    return (
      <Segment.Group >
        { items.map((item, i) => createSegment(item, i)) }
      </Segment.Group>
    );
  }
  console.log(items)
  return (createSegmentSubGroup(items));
}

export default ComplexSegmentGroup
