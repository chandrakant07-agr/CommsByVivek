import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles/About.module.css';

const About = () => {
    const storyPoints = [
        {
            title: 'Vision',
            description: 'To bridge the gap between commercial success and artistic integrity, creating content that serves both purpose and passion.'
        },
        {
            title: 'Mission',
            description: 'Crafting visual narratives that resonate deeply with audiences while achieving strategic business objectives.'
        },
        {
            title: 'Values',
            description: 'Authenticity, creativity, excellence, and the belief that every story deserves to be told with cinematic beauty.'
        }
    ];

    return (
        <div id='about'>
            {/* Hero Section */}
            <section className="heroSection">
                <motion.div
                    className="heroContent"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <motion.h1
                        className="heroTitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        About
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>

                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Two identities, one passionate creator. Discover the dual world of commercial excellence and artistic exploration.
                    </motion.p>
                </motion.div>
            </section>

            {/* Split Brand Section */}
            <section className={styles.splitSection}>
                <motion.div
                    className={styles.commsBrand}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: false }}
                >
                    <div className={styles.brandPattern}></div>
                    <div className={styles.brandContent}>
                        <h2>CommsByVivek</h2>
                        <h5>The Commercial Powerhouse</h5>
                        <p>
                            Where strategy meets creativity. CommsByVivek delivers high-impact
                            visual content for brands, agencies, and businesses looking to make
                            a lasting impression in the market.
                        </p>
                        <p>
                            We understand that commercial success requires more than just beautiful
                            visuals – it demands strategic thinking, brand alignment, and measurable results.
                        </p>
                        <ul className={styles.brandFeatures}>
                            <li>Brand Campaigns & Identity</li>
                            <li>Corporate Photography</li>
                            <li>Marketing Content Creation</li>
                            <li>Product & Lifestyle Shoots</li>
                            <li>Event & Conference Coverage</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.filmedBrand}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: false }}
                >
                    <div className={styles.brandPattern}></div>
                    <div className={styles.brandContent}>
                        <h2>FilmedByVivek</h2>
                        <h5>The Creative Laboratory</h5>
                        <p>
                            Where art meets soul. FilmedByVivek is the creative playground where
                            experimental ideas flourish, personal stories unfold, and artistic
                            boundaries are continuously pushed.
                        </p>
                        <p>
                            This is where raw emotion, authentic storytelling, and artistic risk-taking
                            come together to create work that moves hearts and challenges perspectives.
                        </p>
                        <ul className={styles.brandFeatures}>
                            <li>Documentary Filmmaking</li>
                            <li>Personal Narratives</li>
                            <li>Experimental Projects</li>
                            <li>Artistic Collaborations</li>
                            <li>Social Impact Stories</li>
                        </ul>
                    </div>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <motion.h1
                    className="storyTitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    Our Foundation
                </motion.h1>
                <div className="separatorStoryTitle"></div>

                <div className={styles.storyGridContainer}>
                    {storyPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            className={styles.storyCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <h2>{point.title}</h2>
                            <p>{point.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;