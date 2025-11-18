import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdDownload, MdBackup, MdInfo } from 'react-icons/md';
import { useDownloadBackupMutation } from '../../../store/api/backupApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './styles/Backup.module.css';

const Backup = () => {
    const [downloadBackup, { isLoading: isDownloading }] = useDownloadBackupMutation();

    const handleDownloadBackup = async () => {
        try {
            await downloadBackup().unwrap();

            toast.success("Database backup downloaded successfully!");
        } catch (error) {
            toast.error('Failed to download backup. Please try again.');
        }
    };

    return (
        <>
            <section className="pageHeader">
                <h1>Database Backup</h1>
                <p>Download and manage your database backups</p>
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <MdBackup className="sectionIcon" />
                        <h2>Database Backup</h2>
                    </div>
                </div>

                <div className={styles.backupSection}>
                    <motion.div
                        className={styles.includedCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.includedHeader}>
                            <MdInfo />
                            <h3>What's Included in Backup?</h3>
                        </div>
                        <ul>
                            <li><span>✓</span> All contact messages</li>
                            <li><span>✓</span> Categories and project types</li>
                            <li><span>✓</span> Client ratings and testimonials</li>
                            <li><span>✓</span> Complete portfolio/gallery items</li>
                            <li><span>✓</span> Metadata, timestamps and all settings</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className={styles.backupInfo}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3>Download Backup</h3>
                        <p>
                            Create a complete backup of your database. The backup will be downloaded
                            as a JSON file with the current date and time.
                        </p>
                    </motion.div>

                    <button
                        onClick={handleDownloadBackup}
                        disabled={isDownloading}
                        className={styles.backupButton}
                        title="Download database backup"
                    >
                        {isDownloading ? (
                            <>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <MdDownload />
                                Download Backup
                            </>
                        )}
                    </button>
                </div>
            </section>
        </>
    );
};

export default Backup;