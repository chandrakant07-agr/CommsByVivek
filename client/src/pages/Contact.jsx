import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './styles/Contact.module.css';
import { MdAlternateEmail } from 'react-icons/md';
import {
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaVimeo,
    FaPhone,
    FaLocationArrow,
    FaClock } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since this is frontend only, just log to console
        console.log('Form submission:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');

        // Reset form
        setFormData({
            name: '',
            email: '',
            projectType: '',
            message: ''
        });
    };

    const contactDetails = [
        {
            icon: <MdAlternateEmail />,
            label: 'Email',
            value: 'hello@commsbyvivek.com'
        },
        {
            icon: <FaPhone />,
            label: 'Phone',
            value: '+91 9876 543 210'
        },
        {
            icon: <FaLocationArrow />,
            label: 'Location',
            value: 'Mumbai, India'
        },
        {
            icon: <FaClock />,
            label: 'Response Time',
            value: 'Within 24 hours'
        }
    ];

    const projectTypes = [
        'Brand Campaign',
        'Corporate Photography',
        'Product Photography',
        'Event Coverage',
        'Documentary Project',
        'Creative Collaboration',
        'Other'
    ];

    return (
        <div className={styles.contactPage}>
            {/* Contact Content */}
            <section className={styles.contactContent}>
                <div className={styles.sectionHeader} data-aos="fade-up">
                    <h1 className="heroTitle">Contact</h1>
                    <div className="separatorHeroTitle"></div>
                </div>
                <div className={styles.contentContainer}>
                    {/* Contact Information */}
                    <motion.div
                        className={styles.contactInfo}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.infoTitle}>Let's Connect</h2>
                        <p className={styles.infoText}>
                            Whether you're looking to elevate your brand with compelling commercial content
                            or explore artistic storytelling through FilmedByVivek, we're here to bring
                            your vision to life with cinematic excellence.
                        </p>

                        <div className={styles.contactDetails}>
                            {contactDetails.map((detail, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.contactItem}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={`${styles.contactIcon} iconStyle`}>
                                        {detail.icon}
                                    </div>
                                    <div className={styles.contactText}>
                                        <h6 className={styles.contactLabel}>{detail.label}</h6>
                                        <h6 className={styles.contactValue}>{detail.value}</h6>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={styles.socialSection}>
                            <h5 className={styles.socialTitle}>Follow Our Journey</h5>
                            <div className={styles.socialLinks}>
                                <Link to="#" target='_blank'
                                    className={`${styles.socialLink} iconStyle`} aria-label="Instagram">
                                        <FaInstagram />
                                </Link>
                                <Link to="#" target='_blank'
                                    className={`${styles.socialLink} iconStyle`} aria-label="YouTube">
                                        <FaYoutube />
                                </Link>
                                <Link to="#" target='_blank'
                                    className={`${styles.socialLink} iconStyle`} aria-label="Vimeo">
                                        <FaVimeo />
                                </Link>
                                <Link to="#" target='_blank'
                                    className={`${styles.socialLink} iconStyle`} aria-label="LinkedIn">
                                        <FaLinkedinIn />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className={styles.contactForm}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.formTitle}>Tell Us Your Story</h2>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.formLabel}>Name 
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={styles.formInput}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.formLabel}>Email 
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={styles.formInput}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="projectType" className={styles.formLabel}>Project Type 
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <select
                                    id="projectType"
                                    name="projectType"
                                    className={styles.formSelect}
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a project type</option>
                                    {projectTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.formLabel}>Message 
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className={styles.formTextarea}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell us about your project, vision, timeline, and any specific requirements..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className={styles.submitButton}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start a Story
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;