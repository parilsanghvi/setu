import React from 'react';
import styles from './OnboardingStatus.module.scss';

const OnboardingStatus = ({ data }) => {
    if (!data) return null;
    const { ok, completeness, stale, missing, generatedAt } = data;

    // 100% completeness = success, regardless of staleness
    const isComplete = completeness === 100;
    const statusClass = `${styles.container} ${isComplete ? styles.success : styles.error}`;

    return (
        <div
            className={statusClass}
            role="status"
            aria-label={isComplete ? "Onboarding Complete" : "Onboarding Incomplete"}
        >
            <div className={styles.header}>
                <span className={styles.icon} role="img" aria-hidden="true">{isComplete ? '✅' : '❌'}</span>
                Onboarding: <span className={styles.percent}>{completeness}%</span>
            </div>

            {stale && (
                <div className={styles.staleBadge}>
                    <span className={styles.staleIcon} role="img" aria-hidden="true">⟳</span> Docs may be out of sync with latest commit
                </div>
            )}

            {!isComplete && (
                <div className={styles.details}>
                    {missing?.length > 0 && (
                        <ul className={styles.missingList} aria-label="Missing items">
                            {missing.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                    <div className={styles.fixAction}>
                        Fix now: <code>setu onboarding enrich --only-missing</code>
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
