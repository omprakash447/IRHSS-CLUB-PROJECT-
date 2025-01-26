import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import chatbot from "../src/components/assets/interactional-dialogue.png";

const ChatBot = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Chat Bot Icon */}
      <div className="chat-bot-icon" onClick={handleShow}>
        <img src={chatbot} alt="Chat Bot" />
      </div>

      {/* Bootstrap Modal */}
      <Modal show={show} onHide={handleClose} centered className="custom-modal">
        <Modal.Header closeButton className="modal-header-custom">
          {/* Remove the close button text */}
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <iframe
            src="https://suusri-health.web.app/#/chat"
            width="100%"
            height="500px"
            frameBorder="0"
            title="AI Assistant"
          ></iframe>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatBot;