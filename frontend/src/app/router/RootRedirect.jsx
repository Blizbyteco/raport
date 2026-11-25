import { useEffect } from "react";
import { Navigate } from "react-router";

import useAuth from "@/features/auth/hooks/useAuth";
import getHomePath from "@/shared/lib/homePath";
import { toast } from "@/shared/ui/feedback/toast";

const RootRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      toast.info("Silakan masuk untuk melanjutkan.");
      return;
    }

    toast.success(`Selamat datang kembali, ${user.full_name}.`);
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePath(user.role)} replace />;
};

export default RootRedirect;
