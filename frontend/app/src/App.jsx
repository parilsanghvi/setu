import React, { useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import AgentCard from './components/AgentCard';
import TaskBoard from './components/TaskBoard';
import LogViewer from './components/LogViewer';
import ChatBox from './components/ChatBox';
import OnboardingStatus from './components/OnboardingStatus';
import TaskCreationModal from './components/TaskCreationModal';
import Spinner from './components/Spinner';
import styles from './App.module.scss';
import './index.scss';

const App = () => {
  const { agents, tasks, logs } = useSocket();
  const [onboarding, setOnboarding] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  React.useEffect(() => {
    fetch('/api/onboarding')
      .then(r => r.json())
      .then(setOnboarding)
      .catch(() => { });
  }, []);

  const activeAgentsCount = React.useMemo(() => {
    return agents.filter(a => a.status !== 'OFFLINE').length;
  }, [agents]);

  const [isCommitting, setIsCommitting] = useState(false);

  const handleGitCommit = useCallback(async () => {
    setIsCommitting(true);
    try {
      const res = await fetch('/api/git/commit', { method: 'POST' });
      if (!res.ok) throw new Error('Commit failed');
      alert('Git commit successful!');
    } catch (e) {
      alert('Failed to commit to Git: ' + e.message);
    } finally {
      setIsCommitting(false);
    }
  }, []);

  const handleTaskCreateRequest = useCallback(() => {
    setIsTaskModalOpen(true);
  }, []);

  return (
    <div className={styles.grid}>
      {/* Modals */}
      <TaskCreationModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        agents={agents}
        logs={logs}
      />

      {/* Header / Stats */}
      <div className={styles.header}>
        <h1 className={styles.title}>Setu <span className={styles.version}>v2.0</span></h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleGitCommit}
            disabled={isCommitting}
            className={styles.commitButton}
            aria-label={isCommitting ? "Committing to Git" : "Commit to Git"}
            aria-busy={isCommitting}
          >
            {isCommitting ? <><Spinner size="1em" /> Committing...</> : 'Commit to Git'}
          </button>
          <div className={styles.stats}>
            {activeAgentsCount} <span className={styles.statsLabel}>Active Agents</span>
          </div>
          <OnboardingStatus data={onboarding} />
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
        <TaskBoard tasks={tasks} onTaskCreateRequest={handleTaskCreateRequest} />
      </div>

      {/* Logs */}
      <div className={styles.logs}>
        <LogViewer logs={logs} />
      </div>

      {/* Chat */}
      <div className={styles.chat}>
        <ChatBox agents={agents} logs={logs} />
      </div>
    </div>
  );
};

export default App;
