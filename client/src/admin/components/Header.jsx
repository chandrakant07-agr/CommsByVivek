import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

import styles from "./styles/Header.module.css";

const Header = ({ isMobileMenuOpen }) => {

    const isActive = (href) => {
        return window.location.pathname === href;
    } // only for demo purposes, use NavLink in real app

    
    // const { isAuthenticated, admin } = useSelector((state) => state.auth);
    // const dispatch = useDispatch();

    const logout = () => {
        // dispatch(logoutAdmin());
        logoutAdmin();
    }; // only for demo purposes, use NavLink in real app

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
                </svg>
            ),
        },
        {
            name: 'Messages',
            href: '/admin/messages',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            name: 'Profile',
            href: '/admin/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    return (
        <motion.div className={styles.sidebar}
            initial={{ x: '-100%' }}
            animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className={styles.sidebarHead}>
                <h1>
                    {
                        // isAuthenticated ? "Portfolio Admin" : "Home"
                        "Admin Panel"
                    }
                </h1>
            </div>

            <nav className={styles.navbar}>
                <ul className="">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={item.href}
                                className={`${styles.navbarItem} ${isActive(item.href)
                                    ? styles.active
                                    : ''
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                <span className={styles.itemName}>{item.name}</span>
                            </Link>
                        </li>
                    ))
                    }
                </ul>
            </nav>

            <div className={styles.sidebarFooter}>
                <div className="d-flex a-center">
                    <div className="f-shrink-0">
                        <div className={styles.sidebarFooterIcon}>
                            <span>
                                {/* {admin?.name?.charAt(0).toUpperCase()} */}
                                H
                            </span>
                        </div>
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className={styles.userName}>
                            {/* {admin?.name} */}
                            hello
                        </p>
                        <p className={styles.userEmail}>
                            {/* {admin?.email} */}
                            hello@emai.com
                        </p>
                    </div>
                </div>
                <button onClick={logout} className={styles.logoutButton}>Logout</button>
            </div>
        </motion.div>
    )
}

export default Header;