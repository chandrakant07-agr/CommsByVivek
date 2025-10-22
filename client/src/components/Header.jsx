import { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CiMenuKebab } from 'react-icons/ci';
import { RxMoon, RxSun } from 'react-icons/rx';
import { motion, useScroll } from 'framer-motion';
import { themeToggle } from '../../store/slices/Theme.Slice';
import styles from './styles/Header.module.css';
import logo_black from '../../public/assets/logo/logo_black.png';
import logo_white from '../../public/assets/logo/logo_white.png';

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const toggleTheme = () => dispatch(themeToggle());

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

    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

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
                            {(item.link === "hash")
                                ? <HashLink to={item.path} smooth className={`${styles.navLink}
                                    ${((location.pathname + location.hash) === item.path)
                                        ? styles.active : ''}`
                                }>
                                    {item.label}
                                </HashLink>
                                : <NavLink to={item.path} className={({ isActive }) =>
                                    `${styles.navLink} ${isActive ? styles.active : ''}`
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
                <div className={styles.mobileMenu}>
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
                        <button className={styles.mobileMenuButton}
                            onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                            {isMobileMenuOpen ? '✕' : <CiMenuKebab />}
                        </button>
                    </div>
                </div>
            </nav>

            <motion.div
                className={`${styles.mobileNav}`}
                initial={{ display: 'none', height: 0, y: -25, opacity: 0 }}
                animate={isMobileMenuOpen
                    ? { display: 'block', height: 'auto', y: 0, opacity: 1 }
                    : { display: 'none', height: 0, y: -25, opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ul className={styles.mobileNavLinks}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            {(item.link === "hash")
                                ? <HashLink to={item.path} smooth className={`${styles.mobileNavLink}
                                    ${(location.pathname + location.hash) === item.path
                                        ? styles.active : ''}`
                                    }
                                        onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </HashLink>
                                : <NavLink to={item.path} className={({ isActive }) =>
                                        `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
                                    }
                                        onClick={() => setMobileMenuOpen(false)}
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