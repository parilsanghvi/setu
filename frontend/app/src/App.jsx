import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import AgentCard from './components/AgentCard';
import TaskBoard from './components/TaskBoard';
import LogViewer from './components/LogViewer';
import ChatBox from './components/ChatBox';
import styles from './App.module.scss';
import './index.scss';

const socket = io(); // Connects to the same host/port by default, effectively proxied by Vite

const App = () => {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('log', (msg) => setLogs((p) => [...p, msg].slice(-100)));
    socket.on('log_history', (hist) => setLogs(hist));
    socket.on('agents_update', (data) => setAgents(data));
    socket.on('tasks_update', (data) => setTasks(data));

    return () => {
      socket.off('log');
      socket.off('log_history');
      socket.off('agents_update');
      socket.off('tasks_update');
    };
  }, []);

  const activeAgentsCount = agents.filter(a => a.status !== 'OFFLINE').length;

  return (
    <div className={styles.grid}>
      {/* Header / Stats */}
      <div className={styles.header}>
        <h1 className={styles.title}>Setu <span className={styles.version}>v2.0</span></h1>
        <div className={styles.stats}>
          {activeAgentsCount} <span className={styles.statsLabel}>Active Agents</span>
        </div>
      </div>

      {/* Agent List */}
      <div className={styles.agentList}>
        <div className={styles.sectionTitle}>FLEET</div>
        <div className={styles.agentListContent}>
          {agents.map(a => <AgentCard key={a.name} agent={a} />)}
        </div>
      </div>

      {/* Kanban */}
      <div className={styles.kanban}>
        <TaskBoard tasks={tasks} />
      </div>

      {/* Logs */}
      <div className={styles.logs}>
        <LogViewer logs={logs} />
      </div>

      {/* Chat */}
      <div className={styles.chat}>
        <ChatBox agents={agents} />
      </div>
    </div>
  );
};

export default App;
