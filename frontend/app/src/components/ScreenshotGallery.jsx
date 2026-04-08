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
            {images.map((img) => (
                <a key={img} href={img} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
                    {/* ⚡ Bolt: Added lazy loading to prevent loading off-screen images, improving load time and memory usage */}
                    <img src={img} loading="lazy" className={styles.image} alt="Task Screenshot" />
                </a>
            ))}
        </div>
    );
};

export default ScreenshotGallery;
