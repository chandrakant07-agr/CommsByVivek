import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import LoadingSpinner from '../components/LoadingSpinner';
import { useGetHeroBannerQuery } from '../../store/api/bannerApiSlice';
import styles from './styles/Home.module.css';
import Ripples from '../components/Ripples';

const Home = () => {
    const ref = useRef(null);
    const isInView = useInView(ref);

    const { data: fetchHeroBanner, isLoading: isFetchingHeroBanner } = useGetHeroBannerQuery();

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
                {isFetchingHeroBanner ? (
                    <div className="absolute top-8">
                        <LoadingSpinner
                            size="xl"
                            color="var(--accent-color)"
                            text="video loading..."
                        />
                    </div>
                ) : (
                    <video
                        className={styles.heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source
                            src={fetchHeroBanner?.data?.cloudinaryData.secure_url}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                )}

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
                        <Ripples duration={0.9}>
                            <Link to="/portfolio"
                                className={`${styles.ctaButton} ${styles.primaryCta}`}
                            >
                                View Our Work
                            </Link>
                        </Ripples>
                        <Ripples color="rgba(0, 0, 0, 0.1)" duration={0.9}>
                            <Link to="/contact"
                                className={`${styles.ctaButton} ${styles.secondaryCta}`}
                            >
                                Hire Us
                            </Link>
                        </Ripples>
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
            <section className={styles.introContainer}>
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
                    <Ripples duration={0.9}>
                        <HashLink to="/#about" className={styles.introBtn}>
                            Discover Our Story
                        </HashLink>
                    </Ripples>
                </motion.div>

                <motion.div
                    className={styles.statusCardsContainer}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: false }}
                    ref={ref}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className={styles.statusCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            {
                                isInView &&
                                <CountUp
                                    className={styles.statusCardNumber}
                                    start={0} end={stat.number} suffix="+"
                                    duration={1} delay={0.2}
                                />
                            }
                            <span className={styles.statusCardLabel}>{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
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