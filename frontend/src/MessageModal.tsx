import React, { useRef, useState, ReactNode } from 'react';
import './tokens.css';
import './index.css';
import './app.css';

interface ModalProps {
    headerLabel: string;
    onCloseRequested: () => void;
    children: ReactNode;
  }

function Modal({ headerLabel, onCloseRequested, children }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement | null>(null); // Reference to the modal content

    function handleOverlayClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            onCloseRequested(); // Close modal when clicking outside
        }
    }

    return (
      <div className="message-modal-overlay" onClick={handleOverlayClick}>
          <div ref={dialogRef} className="message-modal">
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{headerLabel}</h2>
                  <button 
                      className="close-button"
                      onClick={onCloseRequested}
                      aria-label="Close"
                  >
                      &times;
                  </button>
              </header>

              <div style={{ marginTop: "10px" }}>
                  {children}
              </div>
          </div>
      </div>
  );
}

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
function MessageModal({ isOpen, onClose }: MessageModalProps) {
    const [message, setMessage] = useState<string>('');

    if (!isOpen) return null;

    const handleSendMessage = () => {
        console.log(`Message sent: ${message}`);
        setMessage(''); // Clear input after sending
    };

    return (
        <Modal headerLabel="Message Seller" onCloseRequested={onClose}>
            <div className="message-input">
                <label htmlFor="message">Type a Message</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <button 
                onClick={handleSendMessage} 
            >
                Send
            </button>
            <div>
                <p className="warning-message"><strong>Warning:</strong> Please do not share any personal information.</p>
            </div>
        </Modal>
    );
}

export default MessageModal;