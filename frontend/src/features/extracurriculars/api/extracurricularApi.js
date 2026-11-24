import api from "@/shared/api/Axios";

export const getExtracurriculars = async (academicYearId) => {
  const response = await api.get("/api/extracurriculars", {
    params: academicYearId ? { academic_year_id: academicYearId } : {},
  });
  return response.data;
};

export const getExtracurricular = async (id) => {
  const response = await api.get(`/api/extracurriculars/${id}`);
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

export const getExtracurricularTeachers = async (
  extracurricularId,
  academicYearId,
) => {
  const response = await api.get(
    `/api/extracurriculars/${extracurricularId}/teachers`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};

export const assignExtracurricularTeacher = async (
  extracurricularId,
  data,
) => {
  const response = await api.post(
    `/api/extracurriculars/${extracurricularId}/teachers`,
    data,
  );
  return response.data;
};

export const removeExtracurricularTeacher = async (
  extracurricularId,
  teacherId,
  academicYearId,
) => {
  const response = await api.delete(
    `/api/extracurriculars/${extracurricularId}/teachers/${teacherId}`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};

export const getExtracurricularStudents = async (
  extracurricularId,
  academicYearId,
) => {
  const response = await api.get(
    `/api/extracurriculars/${extracurricularId}/students`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};

export const addExtracurricularStudents = async (extracurricularId, data) => {
  const response = await api.post(
    `/api/extracurriculars/${extracurricularId}/students`,
    data,
  );
  return response.data;
};

export const removeExtracurricularStudent = async (
  extracurricularId,
  studentId,
  academicYearId,
) => {
  const response = await api.delete(
    `/api/extracurriculars/${extracurricularId}/students/${studentId}`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};
