import React, { Component } from 'react'
import { Header, Modal } from 'semantic-ui-react'

class ModalModalExample extends Component {
  constructor(props) {
    super(props);
    this.state = { open: this.props.open || false };
  }

  open = () => this.setState({ open: true })
  close = () => this.setState({ open: false })

  render() {
    return (
      <Modal open={this.state.open} 
             onOpen={this.open}
             onClose={this.close}>
        <Modal.Header>Transaction Success</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>Default Profile Image</Header>
            {this.props.message}
          </Modal.Description>
        </Modal.Content>
      </Modal>);
  }
}

export default ModalModalExample;
