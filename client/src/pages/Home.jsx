import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
    useGetHeroBannerQuery
} from '../../store/api/bannerApiSlice';
import {
    useGetTotalRatingsQuery
} from '../../store/api/ratingApiSlice';
import {
    useGetTotalGalleryItemsQuery
} from '../../store/api/galleryApiSlice';
import Ripples from '../components/Ripples';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './styles/Home.module.css';

const Home = () => {
    const { data: fetchHeroBanner, isLoading: isFetchingHeroBanner } = useGetHeroBannerQuery();
    const { data: totalRatings, isLoading: isFetchingTotalRatings } = useGetTotalRatingsQuery();
    const { data: totalGallery, isLoading: isFetchingTotalGallery } = useGetTotalGalleryItemsQuery();

    // console.log("Total Ratings:", totalRatings);

    const stats = [
        { number: totalGallery?.data?.totalItems || 0, label: 'Projects Completed' },
        { number: totalRatings?.data?.totalItems || 0, label: 'Happy Clients' },
        {
            number: totalRatings?.data?.overallRating || 0,
            label: <StarRating
                value={totalRatings?.data?.overallRating || 0}
                color="var(--accent-color)"
                size="sm"
                readonly
            />
        },
        { number: 0, label: 'Years Experience' },
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

                {isFetchingTotalGallery || isFetchingTotalRatings ? (
                    <LoadingSpinner color="var(--accent-color)" text="Loading statistics..." />
                ) : (
                    <motion.div
                        className={styles.statusCardsContainer}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: false }}
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
                                <CountUp
                                    className={styles.statusCardNumber}
                                    start={0}
                                    end={stat.number}
                                    duration={1}
                                    delay={0.2}
                                    suffix="+"
                                    decimals={stat.number % 1 !== 0 ? 1 : 0}
                                    enableScrollSpy={true}
                                    scrollSpyDelay={200}
                                >
                                    {({ countUpRef }) => (
                                        <span
                                            ref={countUpRef}
                                            className={styles.statusCardNumber}
                                        />
                                    )}
                                </CountUp>
                                <span className={styles.statusCardLabel}>{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default Home;