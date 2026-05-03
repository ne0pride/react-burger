import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalsRoot = document.getElementById('modals');

export const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal}>
        <header className={`${styles.header} pt-10 pr-10 pl-10`}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <button
            type="button"
            className={styles.close_button}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    modalsRoot
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
