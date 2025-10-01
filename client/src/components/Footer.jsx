import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import styles from './styles/Footer.module.css';
import { MdAlternateEmail } from 'react-icons/md';
import {
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaWhatsapp,
    FaPhone } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            className={styles.footer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <div className={styles.footerLogo}>
                        <Link to="/">
                            <h2>Comms<span>By</span>Vivek</h2>
                        </Link>
                    </div>
                    <ul className={styles.footerLinks}>
                        <li>
                            <span className='iconStyle'><MdAlternateEmail /></span>
                            <Link to="mailto:hello@commsbyvivek.com">hello@commsbyvivek.com</Link>
                        </li>
                        <li>
                            <span className='iconStyle'><FaPhone /></span>
                            <Link to="tel:+919876543210">+91 9876 543 210</Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.footerSection}>
                    <div className={styles.footerNav}>
                        <ul>
                            <li><HashLink to="/#home">Home</HashLink></li>
                            <li><HashLink to="/#about">About</HashLink></li>
                            <li><HashLink to="/#services">Services</HashLink></li>
                            <li><HashLink to="/#filmed-by-vivek">FilmedByVivek</HashLink></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/portfolio">Portfolio</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.footerSection}>
                    <div className={styles.footerSocial}>
                        <Link to="https://instagram.com/" target="_blank" className='iconStyle'>
                            <FaInstagram />
                        </Link>
                        <Link to="https://youtube.com/" target="_blank" className='iconStyle'>
                            <FaYoutube />
                        </Link>
                        <Link to="https://linkedin.com/" target="_blank" className='iconStyle'>
                            <FaLinkedinIn />
                        </Link>
                        <Link to="https://wa.me/1234567890" target="_blank" className='iconStyle'>
                            <FaWhatsapp />
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>© {currentYear} Comms<span>By</span>Vivek. All Rights Reserved.</p>
            </div>
        </motion.footer>
    );
};

export default Footer;