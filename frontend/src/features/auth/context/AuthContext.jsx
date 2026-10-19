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
    console.log("1. LOGOUT CONTEXT DIPANGGIL");
    try {
      console.log("2. SEBELUM LOGOUT API");
      await logoutApi();
      console.log("3. LOGOUT API BERHASIL");
    } catch (error) {
      console.error("4. LOGOUT API ERROR", error);
    } finally {
      console.log("5. SET USER NULL");
      setUser(null);
    }
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
