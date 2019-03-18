import React, { Component } from 'react';
import { Form, Transition, Message } from 'semantic-ui-react'
import lockIcon from '../icons/lock.svg';
import { darkPink, lightPink } from '../style/colors';
import unlockIcon from '../icons/unlock.svg';
import { utils, models } from 'easy_btc';
import { OperationResult } from '../util';
class SigningForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hover: false,
      backgroundColor: lightPink,
      formValue: props.tutorial ? 'cRKHcyn9Diw4GmcAaxRUdJH3Kgaz3j1KBFq1i6QwC2U9STqK7YXm': '',
      error: false,
      errorMessage: '',
      triggerAnimation: false,
    };
  }

  handleMouseEnter = () => {
    if (this.props.unlocked) {
      this.setState({backgroundColor: darkPink});
    }
  }

  handleMouseExit = () => {
    if (this.props.unlocked) {
      this.setState({backgroundColor: lightPink});
    }
  }

  handleChange = (e, { value }) => {
    const validatePriv = this.validatePriv(value);
    if (validatePriv.success) {
      this.setState({
        formValue: value,
        error: false,
        errorMessage: '',
        triggerAnimation: false,
      });
    } else {
      this.setState({
        formValue: value,
        error: true,
        errorMessage: validatePriv.error.message,
        triggerAnimation: true,
      });
    }
  }

  handleClick = () => {
    //TODO the handlers should probable be detached rather than this if statement
    this.props.removeKey(this.props.address);
  }

  validatePriv = (priv) => {
    try {
      if (priv) {
        const keyFormat = utils.getPrivateKeyFormat(priv);
        if (keyFormat !== 'wif_compressed' && keyFormat !== 'wif') {
          return new OperationResult(false, new Error(`Invalid key format '${keyFormat.toUpperCase()}'.
            Please encode your key as WIF.`));
        }
      }
    } catch (error) {
      if (error instanceof models.InvalidInputError) {
        return new OperationResult(false, new Error('Invalid key format. Please ensure that your key is encoded as WIF.'));
      }
      return new OperationResult(false, new Error('An unexpected error has occured.'));
    }
    return new OperationResult(true);
  }

  handleSubmit = () => {
    if (this.state.error) {
      this.setState({
        triggerAnimation: !this.state.triggerAnimation,
      });
    } else {
      return this.props.callback(this.props.address, this.state.formValue);
    }
  }

  // TODO add bottom border radius to locked frame
  renderForm = () => {
    return (
      <Form style={{margin: '1rem', marginTop: '2.5rem'}} onSubmit={this.handleSubmit} error={this.state.error}>
        <Transition animation='shake' duration={200} visible={this.state.triggerAnimation}>
          <Message error
                  header='Invalid Input'
                  content={
                    <p style={{overflowWrap: 'break-word'}}>
                      {this.state.errorMessage}
                    </p>
                  }/>
        </Transition>
        <Form.Input name={this.props.address} value={this.state.formValue || ''} onChange={this.handleChange} type={this.props.tutorial ? 'text' : 'password'} placeholder={'Insert private key'} error={this.state.error}/>
        <Form.Button content={'Unlock'} style={{float:'right', margin:0}}/>
      </Form>);
  }

  render() {
    const style = {
      display:'flex',
      flexDirection:'column',
      flexGrow:1,
      background:this.state.backgroundColor,
    };

    if (this.props.unlocked) {
      style.borderRadius = '0.5rem';
    } else {
      style.borderTopLeftRadius = '0.5rem';
      style.borderTopRightRadius = '0.5rem';
    }
    return (
      // TODO check how segment retains min height
      <div style={{display:'flex', flexDirection:'column', margin: '0.5rem', marginTop: '0', flexGrow:1, background:'white', borderRadius: '0.5rem', minHeight: '20rem'}}
           onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseExit} onClick={this.handleClick}>
          <div style={style}>
            <div style={{flexGrow:2}}/>
            <img style={{flexGrow:6}} src={this.props.unlocked? unlockIcon : lockIcon} alt={this.props.unlocked? 'unlockIcon': 'lockIcon'}/>
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

  handleSubmit = (txHash, priv) => {
    this.props.addPrivateKey(txHash, priv);
  }

  removePrivateKey = (txHash) => {
    this.props.removePrivateKey(txHash);
  }

  render() {
    return (
      <div style={{flexGrow: '1', display: 'flex', flexDirection:'column', overflowY:'auto', marginTop: '0.5rem'}}>
        {this.props.transactions.map((tx) => {
          const address = `${tx.txHash}:${Object.keys(tx.outputs)[0]}`;
          return (
            <SigningForm address={address} callback={this.handleSubmit} removeKey={this.removePrivateKey}
                         key={address} unlocked={this.props.privKeys[address] && this.props.privKeys[address].length > 0}
                         tutorial={this.props.tutorial}/>)
        })}
      </div>
    );
  }
}

export default SigningFrame;
