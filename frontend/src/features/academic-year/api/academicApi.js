import api from "@/shared/api/Axios";

export const getAcademicYears = async () => {
  const response = await api.get("/api/academic-years");

  return response.data;
};

export const getAcademicYear = async (id) => {
  const response = await api.get(`/api/academic-years/${id}`);

  return response.data;
};

export const createAcademicYear = async (data) => {
  const response = await api.post("/api/academic-years", data);

  return response.data;
};

export const updateAcademicYear = async (id, data) => {
  const response = await api.put(`/api/academic-years/${id}`, data);

  return response.data;
};

export const deleteAcademicYear = async (id) => {
  const response = await api.delete(`/api/academic-years/${id}`);

  return response.data;
};
