import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import styles from './ChatBox.module.scss';
import classNames from 'classnames';

const ChatBox = ({ agents }) => {
    const { logs } = useSocket();
    const [msg, setMsg] = useState("");
    const [target, setTarget] = useState("Sutradhar");

    // Filter logs for chat messages or show all?
    // For now, let's show all system logs + chat to give "The Matrix" feel
    // OR filter for [CHAT] prefix we added in useSocket
    const chatHistory = logs.filter(l => typeof l === 'string' && l.startsWith('[CHAT]'));

    const send = async () => {
        if (!msg) return;
        // Optimistic update not needed as we listen to the socket
        await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent: target, message: msg })
        });
        setMsg("");
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>COMMS</div>
            <div className={styles.messageList}>
                {chatHistory.map((h, i) => (
                    <div key={i} className={styles.logEntry}>
                        {h}
                    </div>
                ))}
            </div>
            <div className={styles.footer}>
                <select
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    className={styles.targetSelect}
                >
                    {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
                <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    className={styles.msgInput}
                    placeholder="Message agent..."
                />
                <button onClick={send} className={styles.sendButton}>SEND</button>
            </div>
        </div>
    );
};

export default ChatBox;
