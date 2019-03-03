import React, { Component } from 'react';
import { Segment, Button } from 'semantic-ui-react'
import ReactResizeDetector from 'react-resize-detector';
import { unloggedUtils } from 'easy_btc';

class ContributionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  handleClick = (e, {txhash, outputindex}) => {
    this.props.callback(txhash, outputindex);
  }

  convertbalance = (balance) => {
    return unloggedUtils.convertCurrencyTo(balance, this.props.currency);
  }

  renderSegments = () => {
    let segments = this.props.contributions.map((contribution) => {
      const contributionId = `${contribution.txHash}:${contribution.output.outputIndex}`;
      return (
        <Segment key={contributionId} style={{display: 'flex', alignItems: 'center'}}>
          <Button style={{boxShadow: 'noneƒ', marginRight: '1rem'}} basic size='small' icon='times' onClick={this.handleClick} txhash={contribution.txHash} outputindex={contribution.output.outputIndex}/>
          <div style={{display: 'inline', flexGrow: 1, marginBottom: '0', marginRight: '1rem', overflowX: 'auto'}}>
            <p style={{marginBottom: 0}}>{contributionId}</p>
            <p style={{opacity: '0.75', wordBreak:'break-word'}}>{`script: ${contribution.output.scriptPubKey}`}</p>
          </div>
          <p style={{display: 'inline', overflowX: 'auto'}}>{`${this.convertbalance(contribution.output.balance)} ${this.props.currency}`}</p>
        </Segment>
      )
    });
    return segments;
  }

  render() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, margin:'0.5rem'}}>
          <Segment.Group style={{margin: 0}}>
            {this.renderSegments()}
          </Segment.Group>
          <div style={{flexGrow: 1, flexShrink: 0, display:'flex'}}>
            <ReactResizeDetector handleHeight >
              {
                (width, height) => {
                  if (height < 70) {
                    return <div />;
                  }
                  return (
                    <div style={{flexGrow: 1, flexShrink: 0, borderStyle:'dashed', borderRadius: '20px', borderWidth: '0.25rem', borderColor: 'white', color: 'white', textAlign: 'center', display:'flex', alignItems:'center', justifyContent:'center', marginTop: this.props.contributions.length? '0.5rem': 0}}>
                      <div style={{color: 'white'}}>Add Contributions</div>
                    </div>
                  );
                }
              }
            </ReactResizeDetector>
          </div>
        </div>
    );
  }
}

export default ContributionList;
