import React, { Component } from 'react'
import { Dropdown, Message, Transition } from 'semantic-ui-react'
import { utils } from 'easy_btc';
import { OperationResult } from '../util';

class DropdownExampleSearchQuery extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchQuery: '',
      value: '',
      error: false,
      errorMessage: '',
      triggerAnimation: false,
    }
  }

  validateAddress = (value) => {
    // TODO this is the EXACT same code used in payment frame
    if (!value.length) {
      return new OperationResult(true);
    }

    try {
      const addressType = utils.getAddressFormat(value).toUpperCase();
      if (addressType !== 'P2PKH') {
        return new OperationResult(false, new Error(
          `Address type ${addressType} is not supported. Please supply a P2PKH address.`
        ));
      }
    } catch (error) {
      if (error instanceof utils.InvalidInputFormat) {
        return new OperationResult(false, new Error(
          `Unrecognised address format. Please supply a P2PKH address.`
        ));
      }
      return new OperationResult(false, new Error(
        `An unexpected error has occurred.`
      ));
    }

    try {
      const network = utils.getAddressNetwork(value).toUpperCase();
      const expectedNetwork = this.props.network.toUpperCase();
      if (network !== expectedNetwork) {
        return new OperationResult(false, new Error(
          `This address belongs to an compatible network: ${network}.
          Please use an address from the ${expectedNetwork} or create a new ${network} transaction.`
        ));
      }
    } catch (error) {
      if (error instanceof utils.InvalidInputFormat) {
        return new OperationResult(false, new Error(
          `Unrecognised address network. Please supply a P2PKH address.`
        ));
      }
      return new OperationResult(false, new Error(
        `An unexpected error has occurred.`
      ));
    }

    return new OperationResult(true);
  }

  handleChange = (e, { value }) => {
    if (!this.state.error) {
      this.setState({
        value: value,
      });
      this.props.callback(value);
    } else {
      this.setState({
        triggerAnimation: !this.state.triggerAnimation,
      });
    }
  }

  handleSearchChange = (e, { searchQuery }) => {
    const validation = this.validateAddress(searchQuery);
    console.log('state : '+JSON.stringify(this.state))
    if (!validation.success) {
      this.setState({
        searchQuery,
        error: false,
        errorMessage: '',
        triggerAnimation: false,
      });
    } else {
      this.setState({
        searchQuery,
        error: true,
        errorMessage: validation.error.message,
        triggerAnimation: true,
      });
    }
  }

  get stateOptions () {
    const stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' } ];
    if (this.state.searchQuery.length) {
      stateOptions.push({ key: this.state.searchQuery, value: this.state.searchQuery, text: this.state.searchQuery });
    }
    return stateOptions;
  }
  render() {
    const { searchQuery, value } = this.state

    return (
      <div style={{flexGrow: 1}}>
        { this.state.error &&
          <Transition animation='shake' duration={200} visible={this.state.triggerAnimation}>
            <Message error
                    header='Invalid Input'
                    content={
                      <p style={{overflowWrap: 'break-word'}}>
                        {this.state.errorMessage}
                      </p>
                    }/>
          </Transition>
        }
        <Dropdown
          fluid
          onChange={this.handleChange}
          onSearchChange={this.handleSearchChange}
          options={this.stateOptions}
          placeholder='Select Return Address'
          search
          searchQuery={searchQuery}
          selection
          value={value}
          error={this.state.error}
        />
      </div>
    )
  }
}
export default DropdownExampleSearchQuery;