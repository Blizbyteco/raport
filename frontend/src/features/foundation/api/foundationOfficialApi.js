import api from "@/shared/api/Axios";

export const getFoundationOfficials = async () => {
  const response = await api.get("/api/foundation-officials");
  return response.data;
};

export const createFoundationOfficial = async (data) => {
  const response = await api.post("/api/foundation-officials", data);
  return response.data;
};

export const updateFoundationOfficial = async ({ id, ...data }) => {
  const response = await api.put(`/api/foundation-officials/${id}`, data);
  return response.data;
};

export const deleteFoundationOfficial = async (id) => {
  const response = await api.delete(`/api/foundation-officials/${id}`);
  return response.data;
};
