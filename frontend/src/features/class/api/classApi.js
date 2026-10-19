import api from "@/shared/api/Axios";

export const getClasses = async (params = {}) => {
  const response = await api.get("/api/classes", {
    params,
  });

  return response.data;
};

export const getClass = async (id) => {
  const response = await api.get(`/api/classes/${id}`);
  return response.data;
};

export const createClass = async (data) => {
  const response = await api.post("/api/classes", data);
  return response.data;
};

export const updateClass = async ({ id, ...data }) => {
  const response = await api.put(`/api/classes/${id}`, data);
  return response.data;
};

export const deleteClass = async (id) => {
  const response = await api.delete(`/api/classes/${id}`);
  return response.data;
};
