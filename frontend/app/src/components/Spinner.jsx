import React from 'react';
import styles from './Spinner.module.scss';

const Spinner = ({ className, size = '1em' }) => {
    return (
        <span
            className={`${styles.spinner} ${className || ''}`}
            style={{ width: size, height: size }}
            role="status"
            aria-label="loading"
        />
    );
};

export default Spinner;
