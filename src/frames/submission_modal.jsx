import React, { Component } from 'react'
import { Header, Modal } from 'semantic-ui-react'
import {ObjectInspector} from 'react-inspector';

function SubmissionModal ({open, handleOpen, handleClose, message, result}) {
  const renderContent = () => {
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
           onClose={handleClose}>
      <Modal.Header>Transaction Submitted</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Submission {result}</Header>
          {renderContent()}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default SubmissionModal;
