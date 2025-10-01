import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import styles from './styles/404.module.css';

const Page404 = () => {
    const suggestions = [
        { label: 'View Our Work', path: '/work' },
        { label: 'About Us', path: '/about' },
        { label: 'Our Services', path: '/services' },
        { label: 'FilmedByVivek', path: '/filmed-by-vivek' },
        { label: 'Get in Touch', path: '/contact' }
    ];

    const goBack = () => {
        window.history.back();
    };

    return (
        <div className={styles.notFoundPage}>
            <div className={styles.filmStrip}></div>
            <motion.div
                className={styles.notFoundContent}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className={styles.errorCode}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <CountUp
                        className={styles.statNumber}
                        start={0} end={404}
                        duration={1.5} delay={0.1}
                    />
                </motion.div>

                <motion.h1
                    className={styles.errorTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Not Found
                </motion.h1>

                <motion.div
                    className={styles.errorActions}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Link to="/" className={`${styles.errorButton} ${styles.primaryButton}`}>
                        Return Home
                    </Link>
                    <button
                        onClick={goBack}
                        className={`${styles.errorButton} ${styles.secondaryButton}`}
                    >
                        Go Back
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Page404;