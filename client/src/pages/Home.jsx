import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import styles from './styles/Home.module.css';

const Home = () => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    const stats = [
        { number: '150', label: 'Projects Completed' },
        { number: '50', label: 'Happy Clients' },
        { number: '5', label: 'Years Experience' },
        { number: '25', label: 'Awards Won' },
    ];

    return (
        <div id="home" className={styles.homepage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <video
                    className={styles.heroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className={styles.heroOverlay}></div>

                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <motion.h1
                        className="heroTitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Comms By Vivek
                    </motion.h1>

                    <motion.h4
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.1 }}
                    >
                        Cinematography & Storytelling for Brands, Culture, and People
                    </motion.h4>

                    <motion.div
                        className={styles.heroCta}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.4 }}
                    >
                        <Link to="/portfolio" className={`${styles.ctaButton} ${styles.primaryCta}`}>
                            View Our Work
                        </Link>
                        <Link to="/contact" className={`${styles.ctaButton} ${styles.secondaryCta}`}>
                            Hire Us
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    className={styles.scrollIndicator}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                >
                    <span>Scroll to explore ↓</span>
                </motion.div>
            </section>

            {/* Introduction Section */}
            <section className={styles.intro}>
                <div className={styles.introContent}>
                    <motion.div
                        className={styles.introText}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false }}
                    >
                        <h1>Dual Vision, Single Excellence</h1>
                        <p>
                            CommsByVivek represents the commercial powerhouse - delivering
                            brand campaigns, corporate stories, and marketing content that
                            drives results.
                        </p>
                        <p>
                            FilmedByVivek embodies our artistic soul - creating documentaries,
                            personal narratives, and experimental works that push creative
                            boundaries.
                        </p>
                        <HashLink to="/#about" className={styles.introBtn}>
                            Discover Our Story
                        </HashLink>
                    </motion.div>

                    <motion.div
                        className={styles.introStats}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: false }}
                        ref={ref}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className={styles.stat}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                {/* <span className={styles.statNumber}>{stat.number}</span> */}
                                {
                                    isInView &&
                                    <CountUp
                                        className={styles.statNumber}
                                        start={0} end={stat.number} suffix="+"
                                        duration={1} delay={0.2}
                                    />
                                }
                                <span className={styles.statLabel}>{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;

{/* <CountUp
    start={0} // Starting value of the count
    end={100000} // Ending value of the count
    duration={3} // Duration of the animation in seconds
    delay={0.5} // Delay before the animation starts in seconds
    separator="," // Separator for thousands (e.g., 100,000)
    decimals={0} // Number of decimal places
    prefix="$" // Text to display before the number
    suffix=" USD" // Text to display after the number
    onEnd={() => console.log('CountUp finished!')} // Callback function when animation ends
    onStart={() => console.log('CountUp started!')} // Callback function when animation starts
/> */}