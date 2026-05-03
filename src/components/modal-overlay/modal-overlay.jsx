import PropTypes from 'prop-types';

import styles from './modal-overlay.module.css';

// Универсальная подложка под модальным окном.
// По чек-листу: НЕ должна иметь дочерних элементов.
// Клик по подложке закрывает модалку — обработчик передаётся снаружи.
export const ModalOverlay = ({ onClick }) => {
  return <div className={styles.overlay} onClick={onClick} />;
};

ModalOverlay.propTypes = {
  onClick: PropTypes.func.isRequired,
};
