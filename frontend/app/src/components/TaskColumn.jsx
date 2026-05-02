import React from 'react';
import TaskCard from './TaskCard';
import styles from './TaskColumn.module.scss';

const TaskColumn = ({ status, items, onTaskClick }) => {
    return (
        <div className={styles.column}>
            <div className={styles.columnHeader}>
                {{
                    TODO: 'To Do',
                    IN_PROGRESS: 'In Progress',
                    DONE: 'Done'
                }[status] || status}
                <span className={styles.taskCount} aria-label={`${items.length} tasks`}>
                    ({items.length})
                </span>
            </div>
            <div className={styles.taskList}>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        {{
                            TODO: 'No pending tasks',
                            IN_PROGRESS: 'No active tasks',
                            DONE: 'No completed tasks'
                        }[status] || 'No tasks'}
                    </div>
                ) : (
                    items.map(t => (
                        <TaskCard
                            key={t.id}
                            task={t}
                            onClick={onTaskClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default React.memo(TaskColumn);
