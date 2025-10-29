import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './styles/Portfolio.module.css';
import { FaRegPlayCircle } from 'react-icons/fa';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All Work' },
        { id: 'commercial', label: 'Commercial' },
        { id: 'brand', label: 'Brand Campaigns' },
        { id: 'product', label: 'Product' },
        { id: 'corporate', label: 'Corporate' },
        { id: 'events', label: 'Events' }
    ];

    const projects = [
        {
            id: 1,
            title: 'Luxury Watch Campaign',
            category: 'Brand Campaign',
            type: 'commercial',
            description: 'A cinematic brand campaign showcasing luxury timepieces with dramatic lighting and elegant compositions.',
            year: '2024',
            tags: ['Luxury', 'Product'],
            icon: '⌚'
        },
        {
            id: 2,
            title: 'Tech Startup Branding',
            category: 'Corporate Photography',
            type: 'corporate',
            description: 'Complete visual identity development for an innovative tech startup, including team portraits and office spaces.',
            year: '2024',
            tags: ['Tech', 'Startup'],
            icon: '💻'
        },
        {
            id: 3,
            title: 'Fashion E-commerce Shoot',
            category: 'Product Photography',
            type: 'product',
            description: 'High-impact product photography for a sustainable fashion brand, emphasizing texture and craftsmanship.',
            year: '2023',
            tags: ['Fashion', 'E-commerce'],
            icon: '👗'
        },
        {
            id: 4,
            title: 'Annual Conference 2024',
            category: 'Event Coverage',
            type: 'events',
            description: 'Comprehensive documentation of a three-day international business conference with 500+ attendees.',
            year: '2024',
            tags: ['Conference', 'Business'],
            icon: '🎤'
        },
        {
            id: 5,
            title: 'Automotive Launch',
            category: 'Brand Campaign',
            type: 'brand',
            description: 'Dynamic campaign for luxury automobile launch, featuring dramatic angles and cinematic storytelling.',
            year: '2023',
            tags: ['Automotive', 'Launch'],
            icon: '🚗'
        },
        {
            id: 6,
            title: 'Culinary Arts Portfolio',
            category: 'Commercial Photography',
            type: 'commercial',
            description: 'Mouth-watering food photography for award-winning restaurants and culinary professionals.',
            year: '2024',
            tags: ['Food', 'Restaurant'],
            icon: '🍽️'
        },
        {
            id: 7,
            title: 'Healthcare Innovation',
            category: 'Corporate Photography',
            type: 'corporate',
            description: 'Professional documentation of healthcare facilities and medical technology innovations.',
            year: '2023',
            tags: ['Healthcare', 'Innovation'],
            icon: '🏥'
        },
        {
            id: 8,
            title: 'Music Festival Coverage',
            category: 'Event Coverage',
            type: 'events',
            description: 'High-energy documentation of a three-day music festival, capturing performances and crowd moments.',
            year: '2024',
            tags: ['Music', 'Festival'],
            icon: '🎸'
        },
        {
            id: 9,
            title: 'Cosmetics Campaign',
            category: 'Product Photography',
            type: 'product',
            description: 'Elegant beauty product photography focusing on texture, color, and premium packaging design.',
            year: '2024',
            tags: ['Beauty', 'Cosmetics'],
            icon: '💄'
        }
    ];

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(project => project.type === activeFilter);

    return (
        <>
            {/* Master Showreel Section */}
            <section className="mb-10 text-center">
                <motion.h1
                    className="heroTitle"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    Our Work
                </motion.h1>
                <div className="separatorHeroTitle"></div>
            </section>

            <section className="mb-10">
                <motion.div
                    className={styles.showreelVideo}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <video controls poster="/placeholder-video-poster.jpg">
                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <button className={styles.playButton} aria-label="Play showreel">
                        <FaRegPlayCircle />
                    </button>
                </motion.div>
            </section>

            {/* Portfolio Grid */}
            <section className="px-6 px-lg-10">
                <motion.h1
                    className="heroTitle text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    Featured Projects
                </motion.h1>
                <div className="separatorShowReelTitle"></div>

                {/* Filter Tabs */}
                <motion.div
                    className={styles.filterTabs}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <div className={styles.projectsGrid}>
                    <AnimatePresence>
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className={styles.projectCard}
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={styles.projectThumbnail}>
                                    {/* <span>{project.icon}</span> */}
                                    <div className={styles.projectOverlay}>
                                        View Project
                                    </div>
                                </div>

                                <div className={styles.projectContent}>
                                    <h3 className={styles.projectTitle}>{project.title}</h3>
                                    <h6 className={styles.projectCategory}>{project.category}</h6>
                                    <p className={styles.projectDescription}>{project.description}</p>

                                    <div className={styles.projectMeta}>
                                        <span className={styles.projectYear}>{project.year}</span>
                                        <div className={styles.projectTags}>
                                            {project.tags.map((tag, idx) => (
                                                <span key={idx} className={styles.projectTag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
};

export default Portfolio;