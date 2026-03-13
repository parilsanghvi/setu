import React, { useEffect, useState, useRef } from 'react';
import ChatBox from './ChatBox';
import styles from './TaskCreationModal.module.scss';

const TaskCreationModal = ({ isOpen, onClose, agents, logs }) => {
    const modalRef = useRef(null);
    const onCloseRef = useRef(onClose);

    // Keep onCloseRef up to date to avoid stale closures in the event listener
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Only allow selecting top-level leads
    const [filteredAgents, setFilteredAgents] = useState([]);

    useEffect(() => {
        if (agents) {
            const topLevelNames = ['Sutradhar', 'Guru', 'Tark', 'Shilpi', 'Vishwakarma'];
            // ⚡ React: Move setFilteredAgents outside or ensure agents are valid
            const nextFiltered = agents.filter(a => topLevelNames.includes(a.name));
            setFilteredAgents(nextFiltered);
        }
    }, [agents]);

    // Trap focus and close on escape
    useEffect(() => {
        const previousActiveElement = document.activeElement;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (onCloseRef.current) onCloseRef.current();
            } else if (e.key === 'Tab') {
                if (!modalRef.current) return;
                const focusableElements = modalRef.current.querySelectorAll(
                    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            if (modalRef.current) {
                modalRef.current.focus();
            }
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (isOpen && previousActiveElement && typeof previousActiveElement.focus === 'function') {
                previousActiveElement.focus();
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Draft New Task"
                tabIndex="-1"
                ref={modalRef}
            >
                <div className={styles.header}>
                    <h2>Draft New Task</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close task creation modal">
                        &times;
                    </button>
                </div>
                <div className={styles.content}>
                    <ChatBox
                        agents={filteredAgents}
                        logs={logs}
                        prefillTaskText="I want to create a new task..."
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(TaskCreationModal);
