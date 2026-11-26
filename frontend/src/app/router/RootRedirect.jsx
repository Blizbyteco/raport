import { useEffect } from "react";
import { Navigate } from "react-router";

import useAuth from "@/features/auth/hooks/useAuth";
import getHomePath from "@/shared/lib/homePath";
import LoadingScreen from "@/shared/ui/feedback/LoadingScreen";
import { toast } from "@/shared/ui/feedback/toast";

const RootRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      toast.info("Silakan masuk untuk melanjutkan.");
      return;
    }

    toast.success(
      `Selamat datang kembali, ${user?.full_name ?? "Pengguna"}.`,
    );
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePath(user.role)} replace />;
};

export default RootRedirect;
