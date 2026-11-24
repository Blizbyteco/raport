import useAuth from "./useAuth";

const usePermissions = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === "leader";
  const canManage = user?.role === "admin";

  return { isReadOnly, canManage };
};

export default usePermissions;
