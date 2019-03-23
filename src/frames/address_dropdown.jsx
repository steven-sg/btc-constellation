import React, { Component } from 'react';
import { Dropdown, Message, Transition } from 'semantic-ui-react';
import { utils, models } from 'easy_btc';
import { OperationResult } from '../util';

class AddressDropdown extends Component {
  constructor(props) {
    super(props);
    const stateOptions = props.addresses.map(address => ({ key: address, value: address, text: address }));
    stateOptions.push(
      { key: '', value: '', text: 'None' },
    );
    this.state = {
      searchQuery: props.returnAddress,
      value: props.tutorial ? props.addresses[0] : '',
      error: false,
      errorMessage: '',
      triggerAnimation: false,
      stateOptions,
    };
  }

  get stateOptions() {
    const { stateOptions, searchQuery } = this.state;
    const { addresses } = this.props;
    if (searchQuery.length && !addresses.includes(searchQuery)) {
      const stateOptionsCopy = stateOptions.slice(0);
      stateOptionsCopy.push({ key: searchQuery, value: searchQuery, text: searchQuery });
      return stateOptionsCopy;
    }
    return stateOptions;
  }

  validateAddress = (value) => {
    if (!value.length) {
      return new OperationResult(true);
    }

    try {
      const addressType = utils.getAddressFormat(value).toUpperCase();
      if (addressType !== 'P2PKH') {
        return new OperationResult(false, new Error(
          `Address type ${addressType} is not supported. Please supply a P2PKH address.`,
        ));
      }
    } catch (error) {
      if (error instanceof models.InvalidInputError) {
        return new OperationResult(false, new Error(
          'Unrecognised address format. Please supply a P2PKH address.',
        ));
      }

      return new OperationResult(false, new Error(
        'An unexpected error has occurred.',
      ));
    }

    try {
      const network = utils.getAddressNetwork(value).toUpperCase();
      const expectedNetwork = this.props.network.toUpperCase();
      if (network !== expectedNetwork) {
        return new OperationResult(false, new Error(
          `This address belongs to an compatible network: ${network}.
          Please use an address from the ${expectedNetwork} or create a new ${network} transaction.`,
        ));
      }
    } catch (error) {
      if (error instanceof models.InvalidInputError) {
        return new OperationResult(false, new Error(
          'Unrecognised address network. Please supply a P2PKH address.',
        ));
      }

      return new OperationResult(false, new Error(
        'An unexpected error has occurred.',
      ));
    }

    return new OperationResult(true);
  }

  handleChange = (e, { value }) => {
    const validation = this.validateAddress(value);
    if (validation.success) {
      const { setReturnAddress } = this.props;
      this.setState({
        value,
        error: false,
        errorMessage: '',
      });
      setReturnAddress(value);
    } else {
      const { triggerAnimation } = this.state;
      this.setState({
        error: true,
        errorMessage: validation.error.message,
        triggerAnimation: !triggerAnimation,
      });
    }
  }

  handleSearchChange = (e, { searchQuery }) => {
    const validation = this.validateAddress(searchQuery);

    if (validation.success) {
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

  render() {
    const {
      searchQuery, value, error, errorMessage, triggerAnimation,
    } = this.state;

    return (
      <div style={{ flexGrow: 1 }}>
        { error
          && (
            <Transition animation="shake" duration={200} visible={triggerAnimation}>
              <Message
                error
                header="Invalid Input"
                content={<p style={{ overflowWrap: 'break-word' }}>{errorMessage}</p>}
              />
            </Transition>
          )
        }
        <Dropdown
          fluid
          onChange={this.handleChange}
          onSearchChange={this.handleSearchChange}
          options={this.stateOptions}
          placeholder="Select Return Address"
          search
          searchQuery={searchQuery}
          selection
          value={value}
          error={error}
        />
      </div>
    );
  }
}
export default AddressDropdown;
