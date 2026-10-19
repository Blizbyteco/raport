import api from "@/shared/api/Axios";

export const getCsrfCookie = async () => {
  await api.get("/sanctum/csrf-cookie");
};

export const login = async ({ username, password }) => {
  await getCsrfCookie();

  const response = await api.post("/login", {
    username,
    password,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/user");
  return response.data.user;
};

export const logout = async () => {
  const response = await api.post("/api/logout");
  return response.data;
};
