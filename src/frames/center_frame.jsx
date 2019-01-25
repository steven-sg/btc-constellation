import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import ContributionFrame from './contribution_frame';
import PaymentFrame from './payment_frame';


class CenterFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {frame: 'contribution'};
  }

  handleClick = (e) => {
    if (this.state.frame === 'contribution') {
      this.setState({frame: 'payment'});
    } else {
      this.setState({frame: 'contribution'});
    }
  }

  render() {
    return (
      <div style={{height: '100%', width:'100%', display: 'flex', flexDirection: 'column'}}>
        {/* <div style={{flexGrow: 1}}>
          <ContributionFrame />
        </div> */}
        {this.state.frame === 'contribution' ? <ContributionFrame /> : <PaymentFrame />}
        <div style={{flexBasis: 0, marginTop: '1rem'}}>
          <Button style={{float: 'right'}} content='Next' icon='right arrow' labelPosition='right' onClick={this.handleClick}/>
        </div>
      </div>
    );
  }
}

export default CenterFrame;
