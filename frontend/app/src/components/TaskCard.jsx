import React from 'react';
import styles from './TaskCard.module.scss';

const TaskCard = ({ task, onClick }) => {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onClick(task)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(task);
                }
            }}
            aria-label={`View details for task: ${task.displayTitle}`}
            className={styles.taskCard}
        >
            <div className={styles.taskId}>{task.id}</div>
            <div className={styles.taskTitle}>{task.displayTitle}</div>
            <div className={styles.taskFooter}>
                <span>{task.owner || 'Unassigned'}</span>
                <span className={styles.viewLink}>View 📸</span>
            </div>
        </div>
    );
};

export default React.memo(TaskCard);
