import React from 'react';
import styles from './TaskCard.module.scss';

const getTimeSince = (timestampString) => {
    if (!timestampString) return '';
    const date = new Date(timestampString);
    if (isNaN(date.getTime())) return '';

    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

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
            className={`${styles.taskCard} ${styles[`status${task.status}`] || ''}`}
        >
            <div className={styles.headerRow}>
                <div className={styles.taskId}>{task.id}</div>
                <div className={styles.typeBadge}>{task.type || 'auto'}</div>
            </div>

            <div className={styles.taskTitle}>{task.displayTitle}</div>

            <div className={styles.taskFooter}>
                <div className={styles.assignee}>
                    <span className={styles.avatarIcon}>👤</span>
                    {task.assignee || 'Unassigned'}
                </div>
                <div className={styles.timeSince}>{getTimeSince(task.created_at)}</div>
            </div>
        </div>
    );
};

export default React.memo(TaskCard);
