import React, { useEffect, useRef } from 'react';
import ChatBox from './ChatBox';
import styles from './TaskCreationModal.module.scss';

const TaskCreationModal = ({ isOpen, onClose, agents, logs }) => {
    const modalRef = useRef(null);
    // Only allow selecting top-level leads
    const filteredAgents = React.useMemo(() => {
        if (!agents) return [];
        const topLevelNames = ['Sutradhar', 'Guru', 'Tark', 'Shilpi', 'Vishwakarma'];
        return agents.filter(a => topLevelNames.includes(a.name));
    }, [agents]);

    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Trap focus and close on escape
    useEffect(() => {
        const previousActiveElement = document.activeElement;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (onCloseRef.current) onCloseRef.current();
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
    }, [isOpen]); // Only run when isOpen changes to prevent stealing focus when other props change

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-creation-title"
                tabIndex="-1"
                ref={modalRef}
            >
                <div className={styles.header}>
                    <h2 id="task-creation-title">Draft New Task</h2>
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
