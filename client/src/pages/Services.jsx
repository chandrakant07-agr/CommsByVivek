import { motion } from 'framer-motion';
import styles from './styles/Services.module.css';
import { IoCut } from 'react-icons/io5';
import { GiFilmProjector, GiFilmSpool, GiTShirt, GiVideoCamera } from 'react-icons/gi';

const Services = () => {
    const services = [
        {
            title: 'Video Ads & Commercials',
            icon: <GiVideoCamera />,
            description: 'High-impact commercial content that drives engagement and conversion for brands looking to make a statement.',
            previewImage: ''
        },
        {
            title: 'Corporate Films & Events',
            icon: <GiFilmSpool />,
            description: 'Professional coverage and storytelling for corporate events, conferences, and company milestones.',
            previewImage: ''
        },
        {
            title: 'Fashion & Lifestyle Shoots',
            icon: <GiTShirt />,
            description: 'Captivating visual content for fashion brands, designers, and lifestyle products that demand attention.',
            previewImage: ''
        },
        {
            title: 'Editing & Post Production',
            icon: <IoCut />,
            description: 'Expert editing, color grading, and post-production services that transform raw footage into cinematic stories.',
            previewImage: ''
        },
        {
            title: 'Documentary-Style Content',
            icon: <GiFilmProjector />,
            description: 'Authentic documentary storytelling that captures real moments and genuine human experiences.',
            previewImage: ''
        },
    ];

    return (
        <div id="services">
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
                        Services
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>
                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Comprehensive visual solutions for brands, businesses, and creative projects.
                        From commercial excellence to artistic innovation.
                    </motion.p>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className={styles.servicesGridContainer}>
                {services.map((service, index) => (
                    <motion.div
                        key={service.title}
                        className={styles.serviceCard}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className={styles.serviceIcon}>
                            {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <div className={styles.servicePreview}>
                            {/* <img src={service.previewImage} alt={service.title} /> */}
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
};

export default Services;