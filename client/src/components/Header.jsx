import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, useScroll } from 'framer-motion';
import { RxMoon, RxSun } from 'react-icons/rx';
import { CiMenuKebab } from 'react-icons/ci';
import { useTheme } from '../context/ThemeContext';
import styles from './styles/Header.module.css';
import logo_black from '../assets/logo/logo_black.png';
import logo_white from '../assets/logo/logo_white.png';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const { scrollYProgress } = useScroll();

    const navItems = [
        { link: "hash", label: "Home", path: "/#home" },
        { link: "hash", label: "About", path: "/#about" },
        { link: "hash", label: "Services", path: "/#services" },
        { link: "hash", label: "Filmed By Vivek", path: "/#filmed-by-vivek" },
        { link: "page", label: "Contact", path: "/contact" },
        { link: "page", label: "PortFolio", path: "/portfolio" },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                    <img src={(isDarkMode ? logo_white : logo_black)} alt="CommsByVivek Logo" />
                </Link>

                <ul className={styles.navLinks}>
                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.path}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                        {
                            (item.link === "hash")
                            ? <HashLink to={item.path} smooth className={
                                `${styles.navLink}
                                ${((location.pathname + location.hash) === item.path) ? styles.active : ''}`
                            }>
                                {item.label}
                            </HashLink>
                            : <NavLink to={item.path} className={
                                ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`
                            }>
                                {item.label}
                            </NavLink>
                        }
                        </motion.li>
                    ))}
                    <motion.li
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 6 * 0.1 }}
                    >
                        <button onClick={toggleTheme} className={styles.themeToggle}>
                            {isDarkMode ? <RxSun /> : <RxMoon />}
                        </button>
                    </motion.li>
                </ul>
                <div className={styles.mobileMenuButton}>
                    <div className={styles.navRight}>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 6 * 0.1 }}
                        >
                            <button onClick={toggleTheme} className={styles.themeToggle}>
                                {isDarkMode ? <RxSun /> : <RxMoon />}
                            </button>
                        </motion.div>
                        <button className={styles.mobileMenu}
                            onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                                {isMobileMenuOpen ? '✕' :  <CiMenuKebab />}
                        </button>
                    </div>
                </div>
            </nav>

            <motion.div 
                className={`${styles.mobileNav}`}
                initial={{ display: 'none', height: 0, y: -25, opacity: 0 }}
                animate={isMobileMenuOpen ? { display: 'block', height: 'auto', y: 0, opacity: 1 } : { display: 'none', height: 0, y: -25, opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ul className={styles.mobileNavLinks}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            {
                                (item.link === "hash")
                                ? <HashLink to={item.path} smooth className={`${styles.mobileNavLink}
                                    ${(location.pathname + location.hash) === item.path ? styles.active : ''}`
                                }
                                    onClick={() => setIsMobileMenuOpen(false)}>
                                    {item.label}
                                </HashLink>
                                : <NavLink to={item.path} className={
                                    ({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                                }
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </NavLink>
                            }
                        </li>
                    ))}
                </ul>
            </motion.div>
            <motion.div
                className={styles.scrollProgress}
                style={{
                    scaleX: scrollYProgress
                }}
            />
        </motion.header>
    );
};

export default Header;