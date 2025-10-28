import { motion } from "framer-motion";
import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "./styles/UploadProgressBar.module.css";

const UploadProgressBar = ({ progress = 0, onCancel }) => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    const isComplete = normalizedProgress === 100;

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
                <div className={styles.uploadIconWrapper}>
                    <IoCloudUploadOutline className={styles.uploadIcon} />
                </div>
                <div className={styles.progressInfo}>
                    <h4 className={styles.progressTitle}>
                        {isComplete ? "Upload Complete!" : "Uploading..."}
                    </h4>
                    <p className={styles.progressSubtext}>
                        {isComplete
                            ? "Your file has been uploaded successfully"
                            : "Please wait while we upload your file"}
                    </p>
                </div>
            </div>

            {isComplete ? (
                <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg
                        className={styles.checkIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        />
                    </svg>
                    File successfully uploaded!
                </motion.div>
            ) : (
                <div className={styles.progressBarBackground}>
                    <motion.div
                        className={styles.progressBarFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${normalizedProgress}%` }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Shimmer effect */}
                        <div className={styles.progressBarShimmer} />
                    </motion.div>
                    <motion.div
                        className={styles.progressPercentage}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {Math.round(normalizedProgress)}%
                    </motion.div>
                </div>
            )}

            {/* Cancel Button */}
            <div className="mt-5 text-center">
                <button type="button" className={styles.cancelButton}
                    onClick={onCancel}
                >
                    Cancel Upload
                </button>
            </div>
        </div>
    );
};

export default UploadProgressBar;
