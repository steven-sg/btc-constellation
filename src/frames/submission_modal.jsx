import React, { Component } from 'react'
import { Header, Modal, Button } from 'semantic-ui-react'
import {ObjectInspector} from 'react-inspector';

function SubmissionModal ({open, handleOpen, handleClose, message, result, tutorial, reset}) {
  const renderContent = () => {
    if (tutorial) {
      return (
        <div>
          <p style={{wordBreak: 'break-word'}}>
            Congratulations! You have completed the tutorial.
            Click the button below to return to the starting page.
          </p>
        </div>
      );
    }
    if (result === 'Succeeded') {
      return (
        <div style={{overflow: 'auto'}}>
          <ObjectInspector data={message} name={'response'} expandLevel={10}/>
        </div>
      );
    }
    return (<p style={{wordBreak: 'break-word'}}>{message}</p>);
  }
  return (
    <Modal open={open}
           onOpen={handleOpen}
           onClose={handleClose}
           closeIcon>
      <Modal.Header>Transaction Submitted</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header>Submission {result}</Header>
          {renderContent()}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
          <Button onClick={reset}>Return To Home</Button>
        </Modal.Actions>
    </Modal>
  );
}

export default SubmissionModal;
