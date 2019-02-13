import React, { Component } from 'react'
import { Header, Modal } from 'semantic-ui-react'

function SubmissionModal ({open, handleOpen, handleClose, message, result}) {
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

export default SubmissionModal;
