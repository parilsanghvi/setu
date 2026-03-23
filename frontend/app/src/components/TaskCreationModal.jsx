import React, { useEffect, useMemo } from 'react';
import ChatBox from './ChatBox';
import styles from './TaskCreationModal.module.scss';

const TaskCreationModal = ({ isOpen, onClose, agents, logs }) => {
    // ⚡ Bolt: Removed synchronous setState within useEffect and replaced with useMemo
    // This prevents cascading re-renders when the `agents` array updates.
    const filteredAgents = useMemo(() => {
        if (!agents) return [];
        const topLevelNames = ['Sutradhar', 'Guru', 'Tark', 'Shilpi', 'Vishwakarma'];
        return agents.filter(a => topLevelNames.includes(a.name));
    }, [agents]);

    // Trap focus and close on escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
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
