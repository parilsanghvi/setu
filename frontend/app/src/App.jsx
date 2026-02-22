import React from 'react';
import { useSocket } from './hooks/useSocket';
import AgentCard from './components/AgentCard';
import TaskBoard from './components/TaskBoard';
import LogViewer from './components/LogViewer';
import ChatBox from './components/ChatBox';
import styles from './App.module.scss';
import './index.scss';

const App = () => {
  const { agents, tasks, logs } = useSocket();
  const [onboarding, setOnboarding] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/onboarding')
      .then(r => r.json())
      .then(setOnboarding)
      .catch(() => { });
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
        {onboarding && (
          <div style={{ marginTop: '10px', fontSize: '0.75rem', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid', textAlign: 'center', borderColor: onboarding.ok ? '#166534' : '#991b1b', color: onboarding.ok ? '#4ade80' : '#f87171', backgroundColor: onboarding.ok ? 'rgba(20, 83, 45, 0.2)' : 'rgba(127, 29, 29, 0.2)' }}>
            <div><span style={{ fontWeight: 'bold' }}>Onboarding:</span> {onboarding.completeness}% {onboarding.stale ? '(STALE)' : ''}</div>
            {!onboarding.ok && (
              <>
                <div style={{ marginTop: '0.25rem' }}>Missing: {onboarding.missing.length} artifact(s)</div>
                <div style={{ marginTop: '0.25rem', fontWeight: 'bold', color: '#facc15' }}>Fix now: <code>setu onboarding run</code></div>
              </>
            )}
            {onboarding.generatedAt && <div style={{ marginTop: '0.25rem', color: '#6b7280', opacity: 0.7 }}>Updated: {new Date(onboarding.generatedAt).toLocaleString()}</div>}
          </div>
        )}
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
