import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { GoProjectRoadmap } from "react-icons/go";
import { GrContactInfo, GrGallery, GrMultimedia } from "react-icons/gr";
import { LuMessageSquareMore, LuPanelsLeftBottom, LuUserRound } from "react-icons/lu";
import { useAdminLogoutMutation } from "../../../store/api/adminApiSlice";
import styles from "./styles/Header.module.css";

const Header = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
    const { user: admin } = useSelector((state) => state.auth);
    const [logoutAdmin] = useAdminLogoutMutation();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LuPanelsLeftBottom /> },
        { name: 'Messages', path: '/admin/messages', icon: <LuMessageSquareMore /> },
        { name: 'Profile', path: '/admin/profile', icon: <LuUserRound /> },
        { name: 'Project Type', path: '/admin/projectType', icon: <GoProjectRoadmap /> },
        { name: 'Contact Info', path: '/admin/contactInfo', icon: <GrContactInfo /> },
        { name: 'Gallery', path: '/admin/gallery', icon: <GrGallery /> },
        { name: 'Hero Banner', path: '/admin/heroBanner', icon: <GrMultimedia /> },
    ];

    return (
        <motion.div className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className={styles.sidebarHead}>
                <h1>Admin Panel</h1>
            </div>

            <nav className={styles.navbar}>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={({ isActive }) =>
                                `${styles.navbarItem} ${isActive ? styles.active : ''}`
                            }
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.icon}
                                <span className={styles.itemName}>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className={styles.sidebarFooter}>
                <div className="d-flex a-center">
                    <div className="f-shrink-0">
                        <div className={styles.sidebarFooterIcon}>
                            <span>
                                {admin?.fullName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className={styles.userName}>
                            {admin?.fullName}
                        </p>
                        <p className={styles.userEmail}>
                            {admin?.email}
                        </p>
                    </div>
                </div>
                <button onClick={logoutAdmin} className={styles.logoutButton}>Logout</button>
            </div>
        </motion.div>
    )
}

export default Header;