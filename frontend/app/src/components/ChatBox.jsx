import React, { useState } from 'react';
import styles from './ChatBox.module.scss';
import classNames from 'classnames';

const ChatBox = ({ agents }) => {
    const [msg, setMsg] = useState("");
    const [target, setTarget] = useState("Drona");
    const [history, setHistory] = useState([]);

    const send = async () => {
        if (!msg) return;
        setHistory(prev => [...prev, { from: 'Me', to: target, text: msg }]);
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
                {history.map((h, i) => (
                    <div key={i}>
                        <span className={styles.sender}>{h.from} → {h.to}:</span> <span className={styles.message}>{h.text}</span>
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
