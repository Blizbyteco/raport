import api from "@/shared/api/Axios";

export const getAttendances = async (classSubjectId, params = {}) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/attendances`,
    { params },
  );
  return response.data;
};

export const getAttendance = async (id) => {
  const response = await api.get(`/api/attendances/${id}`);
  return response.data;
};

export const createAttendance = async ({ classSubjectId, data }) => {
  const response = await api.post(
    `/api/class-subjects/${classSubjectId}/attendances`,
    data,
  );
  return response.data;
};

export const updateAttendance = async ({ id, ...data }) => {
  const response = await api.put(`/api/attendances/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await api.delete(`/api/attendances/${id}`);
  return response.data;
};
