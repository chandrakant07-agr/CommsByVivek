import { motion } from 'framer-motion';
import styles from './styles/FilmedByVivek.module.css';

const FilmedByVivek = () => {
    const projects = [
        {
            title: 'Voices of the Street',
            type: 'Documentary Film',
            description: 'An intimate exploration of urban life through the eyes of street artists, capturing their stories, struggles, and the vibrant culture they create in forgotten corners of the city.',
            year: '2024',
            tags: ['Documentary', 'Social Impact', 'Urban Culture'],
            icon: '🎨'
        },
        {
            title: 'The Last Craftsman',
            type: 'Short Documentary',
            description: 'A poignant portrait of traditional artisans preserving ancient crafts in a rapidly modernizing world. A meditation on heritage, skill, and the passage of time.',
            year: '2023',
            tags: ['Heritage', 'Craftsmanship', 'Traditional Arts'],
            icon: '🛠️'
        },
        {
            title: 'Digital Nomads',
            type: 'Experimental Film',
            description: 'A visual essay exploring the intersection of technology and human connection in the age of remote work and digital wandering.',
            year: '2024',
            tags: ['Experimental', 'Technology', 'Modern Life'],
            icon: '💻'
        },
        {
            title: 'Monsoon Memories',
            type: 'Personal Narrative',
            description: 'A deeply personal reflection on childhood, family, and the changing landscape of home, told through the lens of seasonal transformation.',
            year: '2023',
            tags: ['Personal', 'Family', 'Nostalgia'],
            icon: '🌧️'
        },
        {
            title: 'The Underground',
            type: 'Music Documentary',
            description: 'An immersive journey into the underground music scene, capturing raw performances and the passionate community that thrives in the shadows.',
            year: '2024',
            tags: ['Music', 'Underground', 'Performance'],
            icon: '🎵'
        }
    ];

    return (
        <div id="filmed-by-vivek">
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
                        FilmedByVivek
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        "The creative laboratory where stories find their soul"
                    </motion.p>

                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9 }}
                    >
                        This is where artistry transcends commerce. Where experimental narratives,
                        documentary truths, and personal explorations converge to create films
                        that challenge, inspire, and transform both creator and audience.
                    </motion.p>
                </motion.div>
            </section>

            {/* Projects Section */}
            <section className="p-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className={styles.projectItem}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            className={styles.projectVisual}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* <span>{project.icon}</span> */}
                        </motion.div>

                        <div className={styles.projectContent}>
                            <h2 className={styles.projectTitle}>{project.title}</h2>
                            <h5 className={styles.projectType}>{project.type}</h5>
                            <p className={styles.projectDescription}>{project.description}</p>

                            <div className={styles.projectMeta}>
                                <span className={styles.projectYear}>Released {project.year}</span>
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
            </section>
        </div>
    );
};

export default FilmedByVivek;