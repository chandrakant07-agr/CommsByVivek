import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './styles/PortfolioModal.module.css';

const PortfolioModal = ({ item, onClose }) => {
    if (!item) return null;

    const isVideo = item.cloudinaryData?.resource_type === 'video' || item.mediaType === 'video';
    const mediaUrl = item.cloudinaryData?.secure_url;

    // Close modal on escape key press
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                {/* Close Button */}
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <IoCloseOutline />
                </button>
                <motion.div
                    className={styles.modalContent}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Media Container */}
                    {isVideo ? (
                        <video
                            src={mediaUrl}
                            controls
                            autoPlay
                            className={styles.video}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={mediaUrl}
                            alt={item.title}
                            className={styles.image}
                        />
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PortfolioModal;
