import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import { utils, models } from 'easy_btc';
import { GenericLog } from './log_segments';
import TransactionTitle from './transaction_title_segment';

class ComplexSegmentGroup extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  createSection = (dictkey, dict, key) => {
    const sectionDict = dict.getValue(dictkey);
    const containsSubHeadings = utils.isIterable(sectionDict[0]);
    const section = containsSubHeadings ?
      sectionDict.map((masterLog, index) => {
        const singularTitle = dictkey.substring(0, dictkey.length-1);
        return this.createSegmentGroup(`${singularTitle} ${index}`, masterLog, index);
      }) : this.createSegmentGroup(dictkey, sectionDict, key);

    return section;
  }

  createSegmentGroup = (title, logArray, key = 0) => {
    // Pulls transaction state from the append transaction log
    let finalLog = logArray[logArray.length-1];
    if (finalLog instanceof models.OrderedDict) {
      const keys = finalLog.getKeys();
      finalLog = finalLog.getValue(keys[keys.length-1]);
      finalLog = finalLog[finalLog.length-1]
    }
    const transactionDict = finalLog.transactionDict.getArray();
    return (
      <Segment.Group key={key}>
        <TransactionTitle item={title} snapshot={transactionDict}/>
        { logArray.map((log, index) => this.createSegment(log, key, index)) }
      </Segment.Group>
    );
  }

  createSegment = (item, key, index) => {
    if (utils.isIterable(item)) {
      const firstItem = item[0];
      const tailItems = [...item].splice(1);
      const firstSegment = this.createSegment(firstItem, key, index + 1);
      return [firstSegment].concat(this.createSubSegments(tailItems, key, index + 1));
    } else if (item instanceof models.OrderedDict) {
      const items = item.getKeys().map((key, subIndex) => {
        return [
          <Segment inverted color='teal' secondary>{key}</Segment>,
          this.createSegment(item.getValue(key), key, `${index}.${subIndex}`),
        ];
      });
      return items;
    }
    return (
      <Segment key={`${key}.${index}.${item.log}`} style={{overflow: 'auto', wordBreak: 'break-all'}}>
        <GenericLog log={item} showResult/>
      </Segment>
    )
  }

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
        { transaction.logger.getKeys().map((key, i) => this.createSection(key, transaction.logger, i)) }
      </div>
    );
  }
}

export default ComplexSegmentGroup;
