import api from "@/shared/api/Axios";

export const updateProfile = async (data) => {
  const response = await api.put("/api/profile", data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put("/api/profile/password", data);
  return response.data;
};
