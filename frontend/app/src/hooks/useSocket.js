import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Initialize socket outside component to prevent multiple connections
const socket = io({
    autoConnect: false, // We'll connect manually in useEffect
});

const MAX_LOGS = 500;

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [agents, setAgents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        socket.connect();

        function onConnect() {
            setIsConnected(true);
            console.log('[Socket] Connected');
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log('[Socket] Disconnected');
        }

        function onLog(msg) {
            setLogs((prev) => {
                if (prev.length >= MAX_LOGS) {
                    return [...prev.slice(1), msg];
                }
                return [...prev, msg];
            }); // Limit logs
        }

        function onLogHistory(hist) {
            setLogs((prev) => {
                // If new items are more than MAX_LOGS, just take the last MAX_LOGS of them
                if (hist.length >= MAX_LOGS) {
                    return hist.slice(-MAX_LOGS);
                }

                // Calculate how many we can keep from prev
                const keepCount = MAX_LOGS - hist.length;

                // If prev has more than we can keep, slice it
                if (prev.length > keepCount) {
                    return [...prev.slice(-keepCount), ...hist];
                }

                // Otherwise just combine
                return [...prev, ...hist];
            });
        }

        function onAgentsUpdate(data) {
            setAgents(data);
        }

        function onTasksUpdate(data) {
            setTasks(data);
        }

        function onChatMessage(msg) {
            // In a real app we might separate chat from logs, but for now
            // we treat chat messages as high-priority logs
            const logMsg = `[CHAT] ${msg.sender} -> ${msg.recipient}: ${msg.content}`;
            setLogs((prev) => {
                if (prev.length >= MAX_LOGS) {
                    return [...prev.slice(1), logMsg];
                }
                return [...prev, logMsg];
            });
        }

        function onChatHistory(history) {
            // Convert structured history to log format
            const formatted = history.map(msg => `[CHAT] ${msg.sender} -> ${msg.recipient}: ${msg.content}`);
            setLogs((prev) => {
                // If new items are more than MAX_LOGS, just take the last MAX_LOGS of them
                if (formatted.length >= MAX_LOGS) {
                    return formatted.slice(-MAX_LOGS);
                }

                // Calculate how many we can keep from prev
                const keepCount = MAX_LOGS - formatted.length;

                // If prev has more than we can keep, slice it
                if (prev.length > keepCount) {
                    return [...prev.slice(-keepCount), ...formatted];
                }

                // Otherwise just combine
                return [...prev, ...formatted];
            });
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('log', onLog);
        socket.on('log_history', onLogHistory);
        socket.on('chat_history', onChatHistory);
        socket.on('agents_update', onAgentsUpdate);
        socket.on('tasks_update', onTasksUpdate);
        socket.on('chat_message', onChatMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('log', onLog);
            socket.off('log_history', onLogHistory);
            socket.off('chat_history', onChatHistory);
            socket.off('agents_update', onAgentsUpdate);
            socket.off('tasks_update', onTasksUpdate);
            socket.off('chat_message', onChatMessage);
            socket.disconnect();
        };
    }, []);

    return {
        socket,
        isConnected,
        agents,
        tasks,
        logs
    };
};
