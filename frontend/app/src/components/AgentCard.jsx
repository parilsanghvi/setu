import React from 'react';
import classNames from 'classnames';
import styles from './AgentCard.module.scss';

const AgentCard = ({ agent }) => {
    const isOffline = agent.status === 'OFFLINE';

    const cardClass = classNames(styles.card, {
        [styles.offline]: isOffline,
        [styles.active]: !isOffline,
    });

    const statusClass = classNames(styles.statusBadge, {
        [styles.statusOffline]: isOffline,
        [styles.statusActive]: !isOffline,
    });

    return (
        <div className={cardClass}>
            <div>
                <div className={styles.name}>{agent.name}</div>
                <div className={styles.role}>{agent.role}</div>
            </div>
            <div className={statusClass}>
                {agent.status}
            </div>
        </div>
    );
};

export default React.memo(AgentCard);
