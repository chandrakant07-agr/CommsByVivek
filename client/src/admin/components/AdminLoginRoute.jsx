import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetAdminProfileQuery } from "../../../store/api/adminApiSlice";

const AdminLoginRoute = () => {
    const { data: adminProfile, isLoading, isFetching, isError } = useGetAdminProfileQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    if(isLoading || isFetching) return <LoadingSpinner text="Loading admin profile..." />;
    if(adminProfile && !isError) return <Navigate to="/admin/dashboard" replace />;

    return <Outlet />;
};

export default AdminLoginRoute;