import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { BiSolidUserDetail } from "react-icons/bi";
import { MdManageAccounts, MdSecurity } from "react-icons/md";
import {
    useChangeAdminPasswordMutation,
    useGetAdminProfileQuery,
    useUpdateAdminProfileMutation
} from "../../../store/api/adminApiSlice";
import FormInputError from "../../components/FormInputError";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./styles/Profile.module.css"

const Profile = () => {
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);

    const { data: admin, isLoading: isAdminLoading } = useGetAdminProfileQuery();

    const [
        updateProfile, {
            isLoading: isUpdating,
            isSuccess: isProfileUpdated
        }
    ] = useUpdateAdminProfileMutation();

    const [
        changePassword, {
            isLoading: isChangingPassword,
            isSuccess: isPasswordChanged,
            isError: isPasswordError,
            error: passwordError
        }
    ] = useChangeAdminPasswordMutation();

    const {
        reset: infoReset,
        watch: infoWatch,
        register: infoRegister,
        handleSubmit: handleInfoSubmit,
        formState: { errors: infoErrs }
    } = useForm();

    const {
        reset: passwordReset,
        watch: passwordWatch,
        register: passwordRegister,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrs }
    } = useForm();

    // Check that at least one field is available in the profile update form
    const isProfileFormFilled = infoWatch("fullName") || infoWatch("email");

    // Submit profile info unpdate form
    const onSubmitInfo = async (data) => {
        try {
            await updateProfile(data).unwrap();
        } catch (error) {
            toast.error("Failed to update profile Info. Please try again.")
        }
    };

    const onSubmitNewPassword = async (data) => {
        try {
            await changePassword(data).unwrap();
        } catch (error) {
            toast.error("Failed to change password. Please try again.")
        }
    };

    // Close and clear the form if the profile update is successfully submitted
    useEffect(() => {
        if(isProfileUpdated) {
            infoReset();
            setIsEditProfile(false);
        }
    }, [isProfileUpdated, infoReset]);

    // Close and clear the form if the password update is successfully submitted
    useEffect(() => {
        if(isPasswordChanged) {
            passwordReset();
            setIsChangePassword(false);
        }
    }, [isPasswordChanged, passwordReset]);

    return (
        <>
            <section className="pageHeader">
                <h1>Profile Settings</h1>
                <p>Manage your account information and security settings</p>
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <BiSolidUserDetail className="sectionIcon" />
                        <h2>Profile Information</h2>
                    </div>
                    {!isEditProfile && (
                        <button onClick={() => setIsEditProfile(true)}
                            className={styles.profileEditBtn}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isAdminLoading ? (
                    <LoadingSpinner text="Loading profile..." />
                ) : isEditProfile ? (
                    <form className={`${styles.profileUpdateForm} p-4 p-sm-6`}
                        onSubmit={handleInfoSubmit(onSubmitInfo)} noValidate
                    >
                        <div className="h-18 mb-4">
                            <label htmlFor="name">
                                Full Name
                                <sup className="formOptional">(optional)</sup>
                            </label>
                            <input type="text" id="name" placeholder="Enter your full name"
                                {...infoRegister("fullName")}
                            />
                        </div>

                        <div className="h-18">
                            <label htmlFor="email">
                                Email Address
                                <sup className="formOptional">(optional)</sup>
                            </label>
                            <input type="email" id="email" placeholder="Enter your email"
                                className={infoErrs.email && "formInputErrorBorder"}
                                {...infoRegister("email", {
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            <FormInputError message={infoErrs.email?.message} />
                        </div>

                        <div className="d-flex a-center mt-6">
                            <button type="submit" className={styles.updateBtn}
                                disabled={!!isProfileFormFilled === false || isUpdating}
                            >
                                {isUpdating ? 'Updating...' : 'Update Profile'}
                            </button>
                            <button type="button" className={styles.cancelBtn}
                                onClick={() => setIsEditProfile(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.profileInfoContainer}>
                        <div className="d-flex a-center gap-4">
                            <div className={styles.profileLogo}>
                                <span className={styles.profileIcon}>
                                    {admin?.data.fullName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <div className="d-flex a-center gap-2">
                                    <h3 className={styles.profileName}>{admin?.data.fullName}</h3>
                                    <p className={styles.profileRole}>
                                        {admin?.data.role?.replace('_', ' ')}
                                    </p>
                                </div>
                                <p className={styles.profileEmail}>{admin?.data.email}</p>
                            </div>
                        </div>

                        <div className={styles.accountDetails}>
                            <div>
                                <div className={styles.status}>Account Status</div>
                                <div className="mt-1">
                                    <span>Active</span>
                                </div>
                            </div>

                            <div className="d-flex flex-column a-end">
                                <div className={styles.memberSince}>Member Since</div>
                                <div className={styles.joinDate}>
                                    {admin?.data.createdAt
                                        ? format(new Date(admin?.data.createdAt), 'PP')
                                        : 'Not available'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <MdSecurity className="sectionIcon" />
                        <h2>Security Settings</h2>
                    </div>
                    {!isChangePassword && (
                        <button onClick={() => setIsChangePassword(true)}
                            className={styles.changePasswordBtn}
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {isAdminLoading ? (
                    <LoadingSpinner text="Loading profile..." />
                ) : isChangePassword ? (
                    <form className={`${styles.securityUpdateForm} p-4 p-sm-6`}
                        onSubmit={handlePasswordSubmit(onSubmitNewPassword)} noValidate
                    >
                        <div className="h-18 mb-4">
                            <label htmlFor="currentPassword">
                                Current Password
                                <span className="formRequiredStar">*</span>
                            </label>
                            <input type="password" id="currentPassword"
                                placeholder="Enter current password"
                                className={
                                    (isPasswordError || passwordErrs.currentPassword)
                                    && "formInputErrorBorder"
                                }
                                {...passwordRegister("currentPassword", {
                                    required: "Current password is required"
                                })}
                            />
                            <FormInputError message={passwordErrs.currentPassword?.message} />
                            <FormInputError message={passwordError?.data.message} />
                        </div>

                        <div className="h-18 mb-4">
                            <label htmlFor="newPassword">
                                New Password
                                <span className="formRequiredStar">*</span>
                            </label>
                            <input type="password" id="newPassword"
                                placeholder="Enter new password"
                                className={passwordErrs.newPassword && "formInputErrorBorder"}
                                {...passwordRegister("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long"
                                    }
                                })}
                            />
                            <FormInputError message={passwordErrs.newPassword?.message} />
                        </div>

                        <div className="h-18">
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                                <span className="formRequiredStar">*</span>
                            </label>
                            <input type="password" id="confirmPassword"
                                placeholder="Confirm new password"
                                className={passwordErrs.confirmPassword && "formInputErrorBorder"}
                                {...passwordRegister("confirmPassword", {
                                    required: "Please confirm your new password",
                                    validate: (value) =>
                                        value === passwordWatch('newPassword')
                                        || "Confirm Password doesn't match"
                                })}
                            />
                            <FormInputError message={passwordErrs.confirmPassword?.message} />
                        </div>

                        <div className="d-flex a-center mt-6">
                            <button type="submit" className={styles.updateBtn}
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                            <button type="button" className={styles.cancelBtn}
                                onClick={() => setIsChangePassword(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6">
                        <div className={styles.securityDetails}>
                            <h3>Password</h3>
                            <p>Last changed on
                                <span className="ml-1">
                                    {admin?.data.updatedAt
                                        ? format(new Date(admin?.data.passwordUpdatedAt), 'PP p')
                                        : 'Not available'
                                    }
                                </span>
                            </p>
                        </div>

                        <div className={styles.securityWarning}>
                            <div className={styles.warningContent}>
                                <h3>Security Recommendation</h3>
                                <p>
                                    For better security, we recommend changing your password regularly and using a strong, unique password.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <MdManageAccounts className="sectionIcon" />
                        <h2>Account Statistics</h2>
                    </div>
                </div>
                {isAdminLoading ? (
                    <LoadingSpinner text="Loading profile..." />
                ) : (
                    <div className={styles.statisticsGrids}>
                        <div className={styles.statisticsGrid}>
                            <h3>Account Created</h3>
                            <p>
                                {admin?.data.createdAt
                                    ? format(new Date(admin?.data.createdAt), 'PP p')
                                    : 'Not available'
                                }
                            </p>
                        </div>

                        <div className={styles.statisticsGrid}>
                            <h3>Last Updated</h3>
                            <p>
                                {admin?.data.updatedAt
                                    ? format(new Date(admin?.data.updatedAt), 'PP p')
                                    : 'Not available'
                                }
                            </p>
                        </div>

                        <div className={styles.statisticsGrid}>
                            <h3>Last Login</h3>
                            <p>
                                {admin?.data.lastLogin
                                    ? format(new Date(admin?.data.lastLogin), 'PP p')
                                    : 'Not available'
                                }
                            </p>
                        </div>

                        <div className={styles.statisticsGrid}>
                            <h3>Account Role</h3>
                            <p>
                                <span className={styles.roleBadge}>
                                    {admin?.data.role.replace('_', ' ')}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default Profile;