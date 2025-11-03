import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetAdminProfileQuery } from "../../../store/api/adminApiSlice";

const ProtectedRoute = () => {
    const { data: adminProfile, isLoading, isFetching, isError } = useGetAdminProfileQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    if(isLoading || isFetching) return <LoadingSpinner text="Loading admin profile..." />;
    if(!adminProfile || isError) return <Navigate to="/admin" replace />;

    return <Outlet />;
};

export default ProtectedRoute;