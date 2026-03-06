import React, { useState } from 'react';
import Modal from './Modal';
import ScreenshotGallery from './ScreenshotGallery';
import styles from './TaskDetailModal.module.scss';

const TaskDetailModal = ({ task, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReverting, setIsReverting] = useState(false);

    if (!task) return null;

    return (
        <Modal onClose={onClose} title={task.title}>
            <div className={styles.modalContent}>
                <div className={styles.headerRow}>
                    <h2 className={styles.modalTitle}>{task.displayTitle || task.title}</h2>
                    <div className={styles.headerBadges}>
                        <span className={`${styles.badge} ${styles.badgeAuto}`}>{task.type || 'auto'}</span>
                    </div>
                </div>

                <div className={styles.actionRow} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        className={styles.deleteButton}
                        onClick={async () => {
                            if (window.confirm('Delete this task?')) {
                                setIsDeleting(true);
                                try {
                                    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
                                    onClose();
                                } finally {
                                    setIsDeleting(false);
                                }
                            }
                        }}
                        disabled={isDeleting}
                        aria-label="Delete task"
                    >
                        <span aria-hidden="true">🗑️</span> {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    {task.status === 'DONE' && (
                        <button
                            className={styles.revertButton}
                            onClick={async () => {
                                setIsReverting(true);
                                try {
                                    await fetch(`/api/tasks/${task.id}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ status: 'TODO' })
                                    });
                                    onClose();
                                } finally {
                                    setIsReverting(false);
                                }
                            }}
                            disabled={isReverting}
                            aria-label="Revert task to TODO"
                        >
                            <span aria-hidden="true">↩️</span> {isReverting ? 'Reverting...' : 'Revert to TODO'}
                        </button>
                    )}
                </div>

                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>ID</span>
                        <span className={styles.metaValue}>{task.id}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Status</span>
                        <span className={styles.metaValue}>{task.status}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Owner</span>
                        <span className={styles.metaValue}>{task.owner}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Assignee</span>
                        <span className={styles.metaValue}>{task.assignee || 'Unassigned'}</span>
                    </div>
                </div>

                {task.description && (
                    <div className={styles.descriptionBlock}>
                        <div className={styles.sectionHeader}>Description</div>
                        <p className={styles.descriptionText}>{task.description}</p>
                    </div>
                )}

                <div className={styles.galleryHeader}>Visual History</div>
                <ScreenshotGallery taskId={task.id} />
            </div>
        </Modal>
    );
};

export default React.memo(TaskDetailModal);
