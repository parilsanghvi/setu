import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import ScreenshotGallery from './ScreenshotGallery';
import Spinner from './Spinner';
import styles from './TaskBoard.module.scss';

const TaskBoard = React.memo(({ tasks }) => {
    const [newTask, setNewTask] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const createTask = async () => {
        if (!newTask) return;
        setIsCreating(true);
        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTask, type: 'gui-task' })
            });
            setNewTask("");
        } finally {
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isCreating) {
            createTask();
        }
    };

    const cols = useMemo(() => {
        const columns = { TODO: [], IN_PROGRESS: [], DONE: [] };
        tasks.forEach(t => {
            const status = t.status === 'TODO' || t.status === 'PROPOSED' ? 'TODO' : t.status;

            let displayTitle = t.title;
            if (!displayTitle) {
                try {
                    const spec = JSON.parse(t.spec || '{}');
                    displayTitle = spec.task;
                } catch (e) {
                    // Fallback to undefined or handle error if needed
                    console.error('Failed to parse task spec:', e);
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
            {selectedTask && (
                <Modal
                    onClose={() => setSelectedTask(null)}
                    title={selectedTask.title}
                >
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>{selectedTask.title}</h2>
                        <div className={styles.meta}>ID: {selectedTask.id} | Owner: {selectedTask.owner}</div>
                        <div className={styles.galleryHeader}>Visual History</div>
                        <ScreenshotGallery taskId={selectedTask.id} />
                    </div>
                </Modal>
            )}

            <div className={styles.header}>
                <span className={styles.title}>KANBAN</span>
                <div className={styles.controls}>
                    <input
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isCreating}
                        placeholder="New Task..."
                        aria-label="New task title"
                        className={styles.input}
                    />
                    <button
                        onClick={createTask}
                        disabled={isCreating}
                        className={styles.addButton}
                        aria-label={isCreating ? "Creating task" : "Add new task"}
                    >
                        {isCreating ? <Spinner /> : "ADD"}
                    </button>
                </div>
            </div>

            <div className={styles.board}>
                {Object.entries(cols).map(([status, items]) => (
                    <div key={status} className={styles.column}>
                        <div className={styles.columnHeader}>
                            {{
                                TODO: 'To Do',
                                IN_PROGRESS: 'In Progress',
                                DONE: 'Done'
                            }[status] || status}
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
                                    <div
                                        key={t.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setSelectedTask(t)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelectedTask(t);
                                            }
                                        }}
                                        aria-label={`View details for task: ${t.displayTitle}`}
                                        className={styles.taskCard}
                                    >
                                        <div className={styles.taskId}>{t.id}</div>
                                        <div className={styles.taskTitle}>{t.displayTitle}</div>
                                        <div className={styles.taskFooter}>
                                            <span>{t.owner || 'Unassigned'}</span>
                                            <span className={styles.viewLink}>View 📸</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        );
                })}
                    </div>
        </div>
            );
});

            export default React.memo(TaskBoard);
