import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

// Элемент-портал гарантированно есть в index.html — non-null assertion
// допустимая практика для портального контейнера.
const modalsRoot = document.getElementById('modals')!;

type ModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ title, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
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
      <div className={styles.modal} data-testid="modal">
        <header className={`${styles.header} pt-10 pr-10 pl-10`}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <button
            type="button"
            className={styles.close_button}
            onClick={onClose}
            aria-label="Закрыть"
            data-testid="modal-close"
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
