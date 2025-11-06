import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import { MdAlternateEmail, MdLocalPhone } from 'react-icons/md';
import { useGetContactDetailsQuery } from '../../store/api/contactDetailsApiSlice';
import socialPlatforms from '../constants/socialPlatforms';
import styles from './styles/Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { data: getContactDetails } = useGetContactDetailsQuery();

    return (
        <motion.footer
            className={styles.footer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className={styles.footerGridContainer}>
                <div className={styles.footerGridItem}>
                    <div className={styles.footerLogo}>
                        <Link to="/">
                            <h2>Comms<span>By</span>Vivek</h2>
                        </Link>
                    </div>
                    <ul className={styles.footerLinks}>
                        <li>
                            <span className='iconStyle'><MdAlternateEmail /></span>
                            <Link to={`mailto:${getContactDetails?.data.contactDetails?.email}`}>
                                {getContactDetails?.data.contactDetails?.email}
                            </Link>
                        </li>
                        <li>
                            <span className='iconStyle'><MdLocalPhone /></span>
                            <Link to={`tel:${getContactDetails?.data.contactDetails?.phone}`}>
                                {getContactDetails?.data.contactDetails?.phone}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.footerGridItem}>
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

                <div className={styles.footerGridItem}>
                    <div className={styles.footerSocial}>
                        {getContactDetails?.data.socialMediaLinks?.map((media) => (
                            <Link to={media.url} key={media._id} target='_blank'
                                className={`${styles.socialLink} iconStyle`}
                            >
                                {
                                    socialPlatforms.find(platform =>
                                        platform.name === media.platform)?.icon
                                }
                            </Link>
                        ))}
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