import api from "@/shared/api/Axios";

export const getProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data.user;
};

export const updateProfile = async (data) => {
  const response = await api.put("/api/profile", data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put("/api/profile/password", data);
  return response.data;
};
