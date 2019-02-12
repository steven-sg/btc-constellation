import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import lockIcon from '../icons/lock.svg';
import { lightPurple, lighterPurple } from '../style/colors';
import unlockIcon from '../icons/unlock.svg';

class SigningForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hover: false,
      backgroundColor: lighterPurple,
    };
  }

  handleMouseEnter = () => {
    if (this.props.unlocked) {
      this.setState({backgroundColor: lightPurple});
    }
  }

  handleMouseExit = () => {
    if (this.props.unlocked) {
      this.setState({backgroundColor: lighterPurple});
    }
  }

  handleClick = () => {
    //TODO the handlers should probable be detached rather than this if statement
    this.props.removeKey(this.props.address);
  }

  handleSubmit = () => {
    //TODO does this need a return?
    return this.props.callback(this.props.address);
  }

  // TODO add bottom border radius to locked frame
  renderForm = () => {
    return (
      <Form style={{margin: '1rem', marginTop: '2.5rem'}} onSubmit={this.handleSubmit}>
        <Form.Input name={this.props.address} value={this.props.value || ''} onChange={this.props.onChange} type='password' placeholder={'Insert private key'}/>
        <Form.Button content={'Unlock'} style={{float:'right', margin:0}}/>
      </Form>);
  }

  render() {
    return (
      // TODO check how segment retains min height
      <div style={{display:'flex', flexDirection:'column', margin: '0.5rem', marginTop: '0', flexGrow:1, background:'white', borderRadius: '0.5rem', minHeight: '20rem'}}
           onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseExit} onClick={this.handleClick}>
          <div style={{display:'flex', flexDirection:'column', flexGrow:1, background:this.state.backgroundColor, borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
            <div style={{flexGrow:2}}/>
            <img style={{flexGrow:6}} src={this.props.unlocked? unlockIcon : lockIcon} alt={this.props.unlocked? 'unlock': 'lock'}/>
            <div style={{flexGrow:2, display:'flex', justifyContent: 'center', alignItems: 'center', padding:'1rem'}}>
              <div style={{color: 'white', overflowX:'auto', fontWeight: 'bold'}}>
                {this.props.address}
              </div>
            </div>
          </div>
          {!this.props.unlocked && this.renderForm()}
      </div>
    );
  }
}

class SigningFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //TODO migrate onchange to child
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (address) => {
    this.props.addPrivateKey(address, this.state[address]);
  }

  removePrivateKey = (address) => {
    this.props.removePrivateKey(address);
  }

  render() {
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto', marginTop: '0.5rem'}}>
        {this.props.transactions.map((tx) => {
          return (
            <SigningForm address={tx.txHash} value={this.state[tx.txHash]}
                         onChange={this.handleChange} callback={this.handleSubmit} removeKey={this.removePrivateKey}
                         key={tx.txHash} unlocked={this.props.privKeys[tx.txHash] && this.props.privKeys[tx.txHash].length > 0}/>)
        })}
      </div>
    );
  }
}

export default SigningFrame;
