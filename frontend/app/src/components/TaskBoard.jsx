import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import ScreenshotGallery from './ScreenshotGallery';
import Spinner from './Spinner';
import TaskColumn from './TaskColumn';
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
