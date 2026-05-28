import PropTypes from 'prop-types';

import styles from './modal-overlay.module.css';

export const ModalOverlay = ({ onClick }) => {
  return <div className={styles.overlay} onClick={onClick} />;
};

ModalOverlay.propTypes = {
  onClick: PropTypes.func.isRequired,
};
