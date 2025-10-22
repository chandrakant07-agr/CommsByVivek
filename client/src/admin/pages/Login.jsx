import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAdminLoginMutation } from "../../../store/api/adminApiSlice";
import {
    MdAdminPanelSettings,
    MdLogin,
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineLock,
    MdOutlineMailOutline
} from "react-icons/md";
import FormInputError from "../../components/FormInputError";
import styles from "./styles/Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "girish@gmail.com",
            password: "12345678"
        }
    });
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    return (
        <div className={styles.loginContainer}>
            {/* go back button */}
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
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

                <form onSubmit={handleSubmit(adminLogin)} noValidate>
                    <div className={`${styles.formGroup} h-18 mb-6`}>
                        <label htmlFor="email">
                            <MdOutlineMailOutline />
                            <div className="d-flex">
                                <h5>Email Address</h5>
                                <span className="fromRequiredStar">*</span>
                            </div>
                        </label>
                        <input type="email" id="email" placeholder="Enter your email"
                            {
                            ...register("email", {
                                required: "Email is required", pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        <FormInputError message={errors.email?.message} />
                    </div>

                    <div className={`${styles.formGroup} h-18 mb-7`}>
                        <label htmlFor="password">
                            <MdOutlineLock />
                            <div className="d-flex">
                                <h5>Password</h5>
                                <span className="fromRequiredStar">*</span>
                            </div>
                        </label>
                        <input type="password" id="password" placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required", 
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        <FormInputError message={errors.password?.message} />
                    </div>
                    <button type="submit" className={styles.btnLogin} disabled={isLoading}>
                        <MdLogin />
                        {
                            isLoading ? (
                                <span>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Logging in...
                                </span>
                            ) : (
                                <span>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Login
                                </span>
                            )
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;