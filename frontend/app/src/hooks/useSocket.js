import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { updateLogs } from '../utils/logUtils';

const MAX_LOGS = 500;

// Build auth header from browser's cached credentials
// The browser auto-attaches Basic Auth headers to fetch() after the initial prompt,
// so we can extract them by making a test fetch and reading the request.
function getStoredCredentials() {
    // Check if credentials were stored in sessionStorage from a previous page load
    return sessionStorage.getItem('setu_auth') || null;
}

function storeCredentials(encoded) {
    sessionStorage.setItem('setu_auth', encoded);
}

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [agents, setAgents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [socketInstance, setSocketInstance] = useState(null);
    const logIdRef = useRef(0);

    useEffect(() => {
        let cancelled = false;

        async function initSocket() {
            // Try to get stored credentials or prompt user
            let authHeader = getStoredCredentials();

            if (!authHeader) {
                // Try a fetch to /api/stats — if browser has cached Basic Auth, it will work
                try {
                    const res = await fetch('/api/stats');
                    if (res.ok) {
                        // Browser is sending auth automatically — but we can't extract the header
                        // So we prompt user for credentials to pass to socket.io
                    }
                } catch (e) {
                    console.error('Failed to fetch initial stats:', e);
                }

                // Prompt for credentials if not stored
                const user = prompt('Dashboard Username:', 'admin');
                if (!user) return;
                const pass = prompt('Dashboard Password:');
                if (!pass) return;

                authHeader = btoa(`${user}:${pass}`);
                storeCredentials(authHeader);
            }

            if (cancelled) return;

            const socket = io({
                autoConnect: true,
                extraHeaders: {
                    authorization: `Basic ${authHeader}`
                },
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            authorization: `Basic ${authHeader}`
                        }
                    }
                }
            });

            setSocketInstance(socket);

            function formatLog(content) {
                logIdRef.current += 1;
                return { id: logIdRef.current, content };
            }

            socket.on('connect', () => {
                if (!cancelled) setIsConnected(true);
                console.log('[Socket] Connected');
            });

            socket.on('disconnect', () => {
                if (!cancelled) setIsConnected(false);
                console.log('[Socket] Disconnected');
            });

            socket.on('connect_error', (err) => {
                console.error('[Socket] Connection error:', err.message);
                if (err.message === 'Invalid credentials' || err.message === 'Authentication required') {
                    // Clear stored credentials and retry
                    sessionStorage.removeItem('setu_auth');
                    socket.disconnect();
                    if (!cancelled) initSocket();
                }
            });

            socket.on('log', (msg) => {
                if (!cancelled) setLogs((prev) => updateLogs(prev, formatLog(msg), MAX_LOGS));
            });

            socket.on('log_history', (hist) => {
                const formatted = hist.map(content => formatLog(content));
                if (!cancelled) setLogs((prev) => updateLogs(prev, formatted, MAX_LOGS));
            });

            socket.on('agents_update', (data) => {
                if (!cancelled) setAgents(data);
            });

            socket.on('tasks_update', (data) => {
                if (!cancelled) setTasks(data);
            });

            socket.on('chat_message', (msg) => {
                const logMsg = `[CHAT] ${msg.sender} -> ${msg.recipient}: ${msg.content}`;
                if (!cancelled) setLogs((prev) => updateLogs(prev, formatLog(logMsg), MAX_LOGS));
            });

            socket.on('chat_history', (history) => {
                const formatted = history.map(msg => formatLog(`[CHAT] ${msg.sender} -> ${msg.recipient}: ${msg.content}`));
                if (!cancelled) setLogs((prev) => updateLogs(prev, formatted, MAX_LOGS));
            });
        }

        initSocket();

        return () => {
            cancelled = true;
            setSocketInstance(prev => {
                if (prev) prev.disconnect();
                return null;
            });
        };
    }, []);

    return {
        socket: socketInstance,
        isConnected,
        agents,
        tasks,
        logs
    };
};
