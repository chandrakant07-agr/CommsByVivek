import { NavLink } from "react-router-dom";
import { motion } from 'framer-motion';
import { LuMessageSquareMore, LuPanelsLeftBottom, LuUserRound } from "react-icons/lu";
import { useAdminLogoutMutation, useGetAdminProfileQuery } from "../../../store/api/adminApiSlice";
import styles from "./styles/Header.module.css";
import { GoProjectRoadmap } from "react-icons/go";
import { GrContactInfo } from "react-icons/gr";

const Header = ({ isMobileMenuOpen }) => {

    const { data: admin, isSuccess: isAdminLoaded } = useGetAdminProfileQuery();
    const [logoutAdmin] = useAdminLogoutMutation();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LuPanelsLeftBottom /> },
        { name: 'Messages', path: '/admin/messages', icon: <LuMessageSquareMore /> },
        { name: 'Profile', path: '/admin/profile', icon: <LuUserRound /> },
        { name: 'Project Type', path: '/admin/projectType', icon: <GoProjectRoadmap /> },
        { name: 'Contact Info', path: '/admin/contactInfo', icon: <GrContactInfo /> },
        { name: 'Portfolio', path: '/admin/portfolio', icon: <GrContactInfo /> },
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
                                onClick={() => setSidebarOpen(false)}
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
                                {admin?.data.fullName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className={styles.userName}>
                            {admin?.data.fullName}
                        </p>
                        <p className={styles.userEmail}>
                            {admin?.data.email}
                        </p>
                    </div>
                </div>
                <button onClick={logoutAdmin} className={styles.logoutButton}>Logout</button>
            </div>
        </motion.div>
    )
}

export default Header;