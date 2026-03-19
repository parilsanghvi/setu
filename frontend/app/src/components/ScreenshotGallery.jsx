import React, { useState, useEffect } from 'react';
import styles from './ScreenshotGallery.module.scss';

const ScreenshotGallery = ({ taskId }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/tasks/${taskId}/screenshots`)
            .then((r) => r.json())
            .then((data) => {
                setImages(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [taskId]);

    if (loading) return <div className={styles.loading}>Loading shots...</div>;
    if (images.length === 0) return <div className={styles.empty}>No visual history recorded.</div>;

    return (
        <div className={styles.gallery}>
            {images.map((img, index) => (
                <a key={img} href={img} target="_blank" rel="noopener noreferrer" className={styles.imageLink} aria-label={`View full size screenshot ${index + 1} for task ${taskId}`}>
                    <img src={img} className={styles.image} alt={`Screenshot ${index + 1} for task ${taskId}`} />
                </a>
            ))}
        </div>
    );
};

export default ScreenshotGallery;
