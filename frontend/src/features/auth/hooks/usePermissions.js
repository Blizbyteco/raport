import useAuth from "./useAuth";

const usePermissions = () => {
  const { user } = useAuth();
  const isReadOnly = user?.role === "leader";

  return { isReadOnly, canManage: !isReadOnly };
};

export default usePermissions;
