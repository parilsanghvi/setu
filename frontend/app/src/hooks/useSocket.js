import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Initialize socket outside component to prevent multiple connections
const socket = io({
    autoConnect: false, // We'll connect manually in useEffect
});

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
            setLogs((prev) => [...prev, msg].slice(-100)); // Keep last 100 lines
        }

        function onLogHistory(hist) {
            setLogs(hist);
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
            setLogs((prev) => [...prev, `[CHAT] ${msg.sender} -> ${msg.recipient}: ${msg.content}`].slice(-100));
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('log', onLog);
        socket.on('log_history', onLogHistory);
        socket.on('agents_update', onAgentsUpdate);
        socket.on('tasks_update', onTasksUpdate);
        socket.on('chat_message', onChatMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('log', onLog);
            socket.off('log_history', onLogHistory);
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
