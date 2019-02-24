import React from 'react'
import { Modal } from 'semantic-ui-react'

function ErrorModal ({open, handleOpen, handleClose, message}) {
  return (
    <Modal open={open}
          onOpen={handleOpen}
          onClose={handleClose}>
      <Modal.Header>Error</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{wordBreak: 'break-word'}}>{message}</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default ErrorModal;
