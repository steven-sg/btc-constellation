import React, { Component } from 'react'
import { Header, Modal } from 'semantic-ui-react'

function TransactionModal ({open, handleOpen, handleClose, message, result}) {
  console.log(`a${open} b${handleOpen} c${handleClose} d${message} e${result}`);
  return (
    <Modal open={open}
          onOpen={handleOpen}
          onClose={handleClose}>
      <Modal.Header>Transaction Submitted</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Submission {result}</Header>
          <p style={{wordBreak: 'break-word'}}>{message}</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default TransactionModal;
