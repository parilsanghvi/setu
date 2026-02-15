import React, { useState } from 'react';
import Modal from './Modal';
import ScreenshotGallery from './ScreenshotGallery';
import styles from './TaskBoard.module.scss';
import classNames from 'classnames';

const TaskBoard = ({ tasks }) => {
    const [newTask, setNewTask] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

    const createTask = async () => {
        if (!newTask) return;
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask, type: 'gui-task' })
        });
        setNewTask("");
    };

    const cols = { TODO: [], IN_PROGRESS: [], DONE: [] };
    tasks.forEach(t => {
        const status = t.status === 'TODO' || t.status === 'PROPOSED' ? 'TODO' : t.status;
        if (cols[status]) cols[status].push(t);
    });

    return (
        <div className={styles.container}>
            {selectedTask && (
                <Modal onClose={() => setSelectedTask(null)}>
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
                        placeholder="New Task..."
                        className={styles.input}
                    />
                    <button onClick={createTask} className={styles.addButton}>ADD</button>
                </div>
            </div>

            <div className={styles.board}>
                {Object.entries(cols).map(([status, items]) => (
                    <div key={status} className={styles.column}>
                        <div className={styles.columnHeader}>{status}</div>
                        <div className={styles.taskList}>
                            {items.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTask(t)}
                                    className={styles.taskCard}
                                >
                                    <div className={styles.taskId}>{t.id}</div>
                                    <div className={styles.taskTitle}>{t.title || JSON.parse(t.spec || '{}').task}</div>
                                    <div className={styles.taskFooter}>
                                        <span>{t.owner || 'Unassigned'}</span>
                                        <span className={styles.viewLink}>View 📸</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
