import React from 'react';
import styles from './OnboardingStatus.module.scss';

const OnboardingStatus = ({ data }) => {
    if (!data) return null;
    const { ok, completeness, stale, missing, generatedAt } = data;

    const statusClass = `${styles.container} ${ok ? styles.success : styles.error}`;

    return (
        <div
            className={statusClass}
            role="status"
            aria-label={ok ? "Onboarding Complete" : "Onboarding Incomplete"}
        >
            <div className={styles.header}>
                <span className={styles.icon} aria-hidden="true">{ok ? '✅' : '❌'}</span>
                Onboarding: <span className={styles.percent}>{completeness}%</span>
                {stale && <span className={styles.stale}>(STALE)</span>}
            </div>

            {!ok && (
                <div className={styles.details}>
                    {missing?.length > 0 && (
                        <ul className={styles.missingList} aria-label="Missing items">
                            {missing.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                    <div className={styles.fixAction}>
                        Fix now: <code>setu onboarding run</code>
                    </div>
                </div>
            )}

            {generatedAt && (
                <div className={styles.timestamp}>Updated: {new Date(generatedAt).toLocaleString()}</div>
            )}
        </div>
    );
};

export default React.memo(OnboardingStatus);
