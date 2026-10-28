import { Navigate } from "react-router";
import useAuth from "@/features/auth/hooks/useAuth";

const RootRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;
