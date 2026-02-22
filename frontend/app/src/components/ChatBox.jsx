import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import Spinner from './Spinner';
import styles from './ChatBox.module.scss';

const ChatBox = ({ agents }) => {
    const { logs } = useSocket();
    const [msg, setMsg] = useState("");
    const [target, setTarget] = useState("Sutradhar");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Filter logs for chat messages or show all?
    // For now, let's show all system logs + chat to give "The Matrix" feel
    // OR filter for [CHAT] prefix we added in useSocket
    const chatHistory = logs.filter(l => typeof l === 'string' && l.startsWith('[CHAT]'));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const send = async (e) => {
        e.preventDefault();
        if (!msg.trim() || loading) return;

        setLoading(true);
        try {
            // Optimistic update not needed as we listen to the socket
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ agent: target, message: msg })
            });
            setMsg("");
        } finally {
            setLoading(false);
        }
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
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={send} className={styles.footer}>
                <select
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    className={styles.targetSelect}
                    aria-label="Select agent"
                >
                    {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
                <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    className={styles.msgInput}
                    placeholder="Message agent..."
                    aria-label="Message input"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={!msg.trim() || loading}
                    aria-label={loading ? "Sending message" : "Send message"}
                >
                    {loading ? <Spinner /> : "SEND"}
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
