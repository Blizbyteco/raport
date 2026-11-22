import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  login as loginApi,
  logout as logoutApi,
} from "../api/authApi";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      setUser(null);
      return;
    }

    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
