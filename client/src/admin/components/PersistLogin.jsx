import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminRefreshLoginMutation } from "../../../store/api/adminApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const PersistLogin = () => {
    const navigate = useNavigate();
    const [adminRefreshLogin, { isLoading: isRefreshing }] = useAdminRefreshLoginMutation();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await adminRefreshLogin().unwrap();
            } catch (error) {
                // redirect to login on failure
                // navigate("/admin", { replace: true });
            }
        };

        verifyRefreshToken();
    }, []);

    return (
        <>
            {isRefreshing ? (
                <LoadingSpinner text="Verifying admin session..." />
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;