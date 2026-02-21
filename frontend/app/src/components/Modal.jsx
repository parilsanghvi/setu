import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

const Modal = ({ children, onClose, title = "Modal" }) => {
    const modalRef = useRef(null);
    const onCloseRef = useRef(onClose);

    // Keep onCloseRef up to date to avoid stale closures in the event listener
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (onCloseRef.current) {
                    onCloseRef.current();
                }
            }
        };

        // Focus the modal content when it mounts (run once)
        if (modalRef.current) {
            modalRef.current.focus();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

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
