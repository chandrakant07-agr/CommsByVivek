import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxMoon, RxSun } from "react-icons/rx";
import { CiMenuKebab } from "react-icons/ci";
import { themeToggle } from "../../../store/slices/Theme.Slice";
import Header from "./Header";
import styles from "./styles/Header.module.css";

const AdminLayout = () => {
    const dispatch = useDispatch();

    const toggleTheme = () => dispatch(themeToggle());
    
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const { user: admin } = useSelector((state) => state.auth);

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className={styles.adminLayout}>
            <Header isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <div className={styles.mainContainer}>
                <section className={styles.topBarSection}>
                    <div className={styles.topBarContent}>
                        <button
                            onClick={toggleMobileMenu}
                            className={styles.mobileMenuButton}
                        >
                            <CiMenuKebab />
                        </button>

                        <div className={styles.topBarGreeting}>
                            <h5>
                                Welcome back,
                            </h5>
                            <span>{admin?.fullName}</span>
                        </div>
                        <button onClick={toggleTheme} className={styles.themeToggle}>
                            {isDarkMode ? <RxSun /> : <RxMoon />}
                        </button>
                    </div>
                </section>
                <main>
                    <Outlet />
                </main>
            </div>
            {/* Sidebar overlay for mobile */}
            {isMobileMenuOpen &&
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setMobileMenuOpen(false)}
                />
            }
        </div>
    )
}

export default AdminLayout;