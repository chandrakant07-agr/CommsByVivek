import React from "react";
import { useNavigate } from "react-router-dom";
import {
    MdAdminPanelSettings,
    MdLogin,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineLock,
    MdOutlineMailOutline
} from "react-icons/md";
import styles from "./styles/Login.module.css";

const Login = () => {

    const loading = false; // Replace with actual loading state
    const error = null; // Replace with actual error state
    const success = null; // Replace with actual success state

    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Logging in with:', formData);
    }

    const navigate = useNavigate();

    return (
        <div className={styles.loginContainer}>
            {/* go back button */}
            <button className={styles.backBtn} tooltip="Go Back" onClick={() => navigate(-1)}>
                <MdOutlineKeyboardDoubleArrowLeft />
            </button>
            <div className={styles.loginCard}>
                <div className="text-center mb-7">
                    <h1 className={styles.loginTitle}>
                        <MdAdminPanelSettings />
                        Admin Panel
                    </h1>
                    <p className={styles.loginSubtitle}>
                        Sign in
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <i className="fas fa-check-circle"></i>
                        {success}
                    </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                    <div className={`${styles.formGroup} mb-6`}>
                        <label htmlFor="email">
                            <MdOutlineMailOutline />
                            <div className="d-flex">
                                <h6>Email Address</h6>
                                <span className="fromRequiredStar">*</span>
                            </div>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleLoginChange}
                            required
                            placeholder="Enter your email"
                            autoComplete="email"
                        />
                    </div>

                    <div className={`${styles.formGroup} mb-6`}>
                        <label htmlFor="password">
                            <MdOutlineLock />
                            <div className="d-flex">
                                <h6>Password</h6>
                            <span className="fromRequiredStar">*</span>
                            </div>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleLoginChange}
                            required
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className={styles.btnLogin} disabled={loading}>
                        <MdLogin />
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                Login
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Login;