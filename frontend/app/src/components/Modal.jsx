import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ children, onClose }) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                {children}
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Modal;
