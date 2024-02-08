import React, { CSSProperties, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    children: ReactNode;
    onClose: () => void;
}

const modalStyle: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '1000',
  backgroundColor: '#FFF',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const backdropStyle: CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  zIndex: '1000',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
};

const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
};

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose })  => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div style={backdropStyle} onClick={onClose} />
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </>,
    document.body
  );
};

export default Modal;
