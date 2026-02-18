import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

const Modal = ({ children, onClose, title = "Modal" }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus the modal content on mount for screen readers
        if (modalRef.current) {
            modalRef.current.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.content}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex="-1"
                ref={modalRef}
            >
                {children}
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Modal;
