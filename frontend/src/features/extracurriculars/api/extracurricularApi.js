import api from "@/shared/api/Axios";

export const getExtracurriculars = async () => {
  const response = await api.get("/api/extracurriculars");
  return response.data;
};

export const createExtracurricular = async (data) => {
  const response = await api.post("/api/extracurriculars", data);
  return response.data;
};

export const updateExtracurricular = async ({ id, ...data }) => {
  const response = await api.put(`/api/extracurriculars/${id}`, data);
  return response.data;
};

export const deleteExtracurricular = async (id) => {
  const response = await api.delete(`/api/extracurriculars/${id}`);
  return response.data;
};
