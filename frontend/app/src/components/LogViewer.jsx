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
                {logs.map((log, i) => (
                    <div key={i} className={styles.logEntry}>
                        {log}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default LogViewer;
