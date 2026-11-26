import { Navigate, Outlet, useLocation } from "react-router";

import useAuth from "@/features/auth/hooks/useAuth";
import getHomePath from "@/shared/lib/homePath";
import LoadingScreen from "@/shared/ui/feedback/LoadingScreen";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
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
