import { useState } from "react";
import { format } from "date-fns";
import styles from "./styles/Profile.module.css"

const Profile = () => {

    // dummy mutation functions
    const updateProfileMutation = {
        isLoading: false,
        mutate: (data) => {
            console.log("Updating profile with data:", data);
            // Simulate a network request
            setTimeout(() => {
                toast.success("Profile updated successfully");
                setIsEditingProfile(false);
            }, 1000);
        }
    };

    const changePasswordMutation = {
        isLoading: false,
        mutate: (data) => {
            console.log("Changing password with data:", data);
            // Simulate a network request
            setTimeout(() => {
                toast.success("Password changed successfully");
                setIsChangingPassword(false);
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }, 1000);
        }
    };

    // dummy toast function
    const toast = {
        success: (msg) => alert(msg),
        error: (msg) => alert(msg),
    };
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
    });

    const admin = {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        createdAt: "2023-01-01T00:00:00Z",
        lastLogin: "2023-10-01T12:34:56Z",
        updatedAt: "2023-10-15T08:00:00Z",
        isActive: true,
    };

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    return (
        <div>
            <div className={styles.profileHeader}>
                <h1>Profile Settings</h1>
                <p>Manage your account information and security settings</p>
            </div>

            <section className={styles.profileInfo}>
                <div className={styles.profileInfoHeader}>
                    <div className="d-flex a-center justify-between">
                        <h2>Profile Information</h2>
                        {!isEditingProfile && (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isEditingProfile ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateProfileMutation.mutate({
                                name: profileForm.name.trim(),
                                email: profileForm.email.trim(),
                            });
                        }} className={styles.profileInfoUpdateForm}>
                            <div className="mb-4">
                                <label htmlFor="name">
                                    Full Name
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email">
                                    Email Address
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="d-flex a-center mt-6">
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isLoading}
                                    className={styles.updateBtn}
                                >
                                    {updateProfileMutation.isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileForm({
                                            name: admin?.name || '',
                                            email: admin?.email || '',
                                        });
                                        setIsEditingProfile(false);
                                    }}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.profileInfoContainer}>
                            <div className="d-flex a-center">
                                <div className={styles.profileLogo}>
                                    <span className={styles.profileIcon}>
                                        {admin.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <h3 className={styles.profileName}>{admin.name}</h3>
                                    <p className={styles.profileEmail}>{admin.email}</p>
                                    <p className={styles.profileRole}>{admin.role?.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className={styles.accountDetails}>
                                <div>
                                    <div className={styles.status}>Account Status</div>
                                    <div className="mt-1">
                                        <span className={admin.isActive ? 'bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium' : 'bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium'}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-1">
                                    <div className={styles.memberSince}>Member Since</div>
                                    <div className={styles.joinDate}>
                                        {admin.createdAt ? format(new Date(admin.createdAt), 'MMMM dd, yyyy') : 'Not available'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.security}>
                <div className={styles.securityHeader}>
                    <div className="d-flex a-center justify-between">
                        <h2>Security Settings</h2>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {isChangingPassword ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (passwordForm.newPassword === passwordForm.confirmPassword) {
                                changePasswordMutation.mutate(passwordForm);
                            } else {
                                toast.error('Passwords do not match');
                            }
                        }} className={styles.securityUpdateForm}>
                            <div className="mb-4">
                                <label htmlFor="currentPassword">
                                    Current Password
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    placeholder="Enter your current password"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="newPassword">
                                    New Password
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder="Enter your new password"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmPassword">
                                    Confirm New Password
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    placeholder="Confirm your new password"
                                />
                            </div>

                            <div className="d-flex a-center mt-6">
                                <button
                                    type="submit"
                                    disabled={changePasswordMutation.isLoading}
                                    className={styles.updateBtn}
                                >
                                    {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPasswordForm({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: '',
                                        });
                                        setIsChangingPassword(false);
                                    }}
                                    className={styles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className={`${styles.securityDetails} d-flex a-center justify-between`}>
                                <div>
                                    <h3>Password</h3>
                                    <p>Last changed on {admin.updatedAt ? format(new Date(admin.updatedAt), 'MMMM dd, yyyy') : 'Not available'}</p>
                                </div>
                                <div className={styles.password}>••••••••</div>
                            </div>

                            <div className={styles.securityWarning}>
                                <div className="d-flex ml-3">
                                    <div className="ml-3">
                                        <h3>Security Recommendation</h3>
                                        <p>
                                            For better security, we recommend changing your password regularly and using a strong, unique password.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.accountStatistics}>
                <div className={styles.statisticsHeader}>
                    <h2>Account Statistics</h2>
                </div>
                <div className="p-6">
                    <div className={styles.statisticsGrids}>
                        <div className={styles.statisticsGrid}>
                            <h3>Account Created</h3>
                            <p>
                                {admin.createdAt ? format(new Date(admin.createdAt), 'MMMM dd, yyyy') : 'Not available'}
                            </p>
                        </div>

                        <div className={styles.statisticsGrid}>
                            <h3>Last Updated</h3>
                            <p>
                                {admin.updatedAt ? format(new Date(admin.updatedAt), 'MMMM dd, yyyy') : 'Not available'}
                            </p>
                        </div>

                        {admin.lastLogin && (
                            <div className={styles.statisticsGrid}>
                                <h3>Last Login</h3>
                                <p>
                                    {format(new Date(admin.lastLogin), 'MMMM dd, yyyy h:mm a')}
                                </p>
                            </div>
                        )}

                        <div className={styles.statisticsGrid}>
                            <h3>Account Role</h3>
                            <p>
                                <span className={styles.roleBadge}>
                                    {admin.role?.replace('_', ' ')}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile;