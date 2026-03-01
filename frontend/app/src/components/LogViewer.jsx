import React, { useEffect, useRef } from 'react';
import styles from './LogViewer.module.scss';

const LogViewer = ({ logs }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>KERNEL LOGS</div>
            <div className={styles.logList}>
                {logs.map((log) => (
                    <div key={log.id} className={styles.logEntry}>
                        {log.content}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default React.memo(LogViewer);
