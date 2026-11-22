import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/features/auth/hooks/useAuth";

const getHomePath = (role) => {
  if (role === "teacher") {
    return "/teacher";
  }

  if (role === "admin") {
    return "/dashboard";
  }

  return "/profile";
};

const ProtectedRoute = ({ roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
