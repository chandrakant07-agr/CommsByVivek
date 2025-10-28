import { motion } from "framer-motion";
import { ImSpinner9 } from "react-icons/im";
import styles from "./styles/LoadingSpinner.module.css";

/**
 * LoadingSpinner Component
 * 
 * A reusable animated spinner component for loading states
 * 
 * @param {string} text - Optional loading text to display below spinner
 * @param {string} size - Size of spinner: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} color - Custom color (optional, defaults to theme primary color)
 * @param {boolean} fullPage - If true, centers spinner in full viewport
 * @param {string} backgroundColor - Background color for the container (optional)
 * @returns {React.ReactElement} Loading spinner component
 */

const LoadingSpinner = ({
    text,
    size = "md",
    fullPage = false,
    color = "var(--dark-blue)",
    backgroundColor = "transparent"
}) => {
    const sizeClasses = {
        sm: styles.spinnerSm,
        md: styles.spinnerMd,
        lg: styles.spinnerLg,
        xl: styles.spinnerXl
    };

    const spinnerClass = `${styles.spinner} ${sizeClasses[size] || sizeClasses.md}`;
    const containerClass = fullPage ? styles.fullPageContainer : styles.container;

    return (
        <div className={containerClass} style={backgroundColor ? { backgroundColor } : {}}>
            <motion.div
                className={spinnerClass}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={color ? { color } : {}}
            >
                <ImSpinner9 />
            </motion.div>
            {text && (
                <motion.p
                    className={styles.loadingText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    // transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default LoadingSpinner;
