import React, { useState, useRef, useEffect, useMemo } from 'react';
import Spinner from './Spinner';
import { marked } from 'marked';
import styles from './ChatBox.module.scss';

const ChatBox = ({ agents, logs, prefillTaskText }) => {
    const [msg, setMsg] = useState("");
    const [target, setTarget] = useState("Sutradhar");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (prefillTaskText) {
            setMsg(prefillTaskText);
            setTarget("Sutradhar");
        }
    }, [prefillTaskText]);

    const chatHistory = useMemo(() => {
        // ⚡ Bolt: Replaced O(N²) reallocation inside `.reduce()` with a single-pass O(N) loop
        // using a Set to track active typing states. This prevents severe UI jank as chat history grows.
        const messages = [];
        const typingAgents = new Set();

        for (let i = 0; i < logs.length; i++) {
            const l = logs[i];
            if (typeof l.content !== 'string') continue;

            if (l.content.startsWith('[CHAT]')) {
                const match = l.content.match(/^\[CHAT\]\s*(.+?)\s*->\s*(.+?):\s*(.*)$/us);
                if (match) {
                    messages.push({
                        id: l.id,
                        sender: match[1],
                        recipient: match[2],
                        content: match[3],
                        isAgent: match[1] !== 'User'
                    });
                }
            } else if (l.content.startsWith('[THOUGHT_START]')) {
                const match = l.content.match(/^\[THOUGHT_START\]\s*(.+?)\s*->/us);
                if (match) {
                    const agent = match[1];
                    if (agent !== 'ALL' && agent !== 'User' && agent !== 'System') {
                        typingAgents.add(agent);
                    }
                }
            } else if (l.content.startsWith('[THOUGHT_END]')) {
                const match = l.content.match(/^\[THOUGHT_END\]\s*(.+?)\s*->/us);
                if (match) {
                    typingAgents.delete(match[1]);
                }
            }
        }

        for (const agent of typingAgents) {
            messages.push({
                id: `typing-${agent}`,
                isAgent: true,
                sender: agent,
                isTyping: true
            });
        }

        return messages;
    }, [logs]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(e);
        }
    };

    const send = async (e) => {
        e.preventDefault();
        if (!msg.trim() || loading) return;

        setLoading(true);
        try {
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

    const renderMessageContent = (content) => {
        const html = marked.parse(content, { breaks: true });
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>CHAT</span>
                <select
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                    className={styles.targetSelect}
                    aria-label="Select agent"
                >
                    {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                </select>
            </div>
            <div className={styles.messageList}>
                {chatHistory.map((h, i) => (
                    <div key={h.id + i} className={`${styles.messageWrapper} ${h.isAgent ? styles.agentWrapper : styles.userWrapper}`}>
                        <div className={`${styles.messageBubble} ${h.isAgent ? styles.agentBubble : styles.userBubble}`}>
                            {h.isAgent && <div className={styles.senderName}>{h.sender}</div>}
                            {h.isTyping ? (
                                <div className={styles.typingIndicator}>
                                    <span></span><span></span><span></span>
                                </div>
                            ) : (
                                <div className={styles.content}>
                                    {h.isAgent ? renderMessageContent(h.content) : h.content}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={send} className={styles.footer}>
                <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.msgInput}
                    placeholder="Message agent (Shift+Enter for newline)..."
                    aria-label="Message input"
                    disabled={loading}
                    rows="1"
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

export default React.memo(ChatBox);
