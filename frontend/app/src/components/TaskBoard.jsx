import React, { useState, useMemo } from 'react';
import TaskDetailModal from './TaskDetailModal';
import TaskColumn from './TaskColumn';
import styles from './TaskBoard.module.scss';

const TaskBoard = React.memo(({ tasks, onTaskCreateRequest }) => {
    const [selectedTask, setSelectedTask] = useState(null);

    const cols = useMemo(() => {
        const columns = { TODO: [], IN_PROGRESS: [], DONE: [] };
        tasks.forEach(t => {
            const status = t.status === 'TODO' || t.status === 'PROPOSED' ? 'TODO' : t.status;

            let displayTitle = t.title;
            if (!displayTitle) {
                try {
                    const spec = JSON.parse(t.spec || '{}');
                    displayTitle = spec.task;
                } catch {
                    // Fallback to undefined or handle error if needed
                }
            }

            if (columns[status]) {
                columns[status].push({ ...t, displayTitle });
            }
        });
        return columns;
    }, [tasks]);

    return (
        <div className={styles.container}>
            <TaskDetailModal
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />

            <div className={styles.header}>
                <span className={styles.title}>KANBAN</span>
                <div className={styles.controls}>
                    <button
                        onClick={onTaskCreateRequest}
                        className={styles.addButton}
                        aria-label="Add new task"
                        title="Create a new task"
                    >
                        ADD BOARD TASK
                    </button>
                </div>
            </div>

            <div className={styles.board}>
                {Object.entries(cols).map(([status, items]) => (
                    <TaskColumn
                        key={status}
                        status={status}
                        items={items}
                        onTaskClick={setSelectedTask}
                    />
                ))}
            </div>
        </div>
    );
});

export default React.memo(TaskBoard);
