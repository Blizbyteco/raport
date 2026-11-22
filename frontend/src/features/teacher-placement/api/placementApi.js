import api from "@/shared/api/Axios";

export const getClassSubjects = async (classId, academicYearId) => {
  const response = await api.get(`/api/classes/${classId}/subjects`, {
    params: { academic_year_id: academicYearId },
  });
  return response.data;
};

export const createClassSubject = async (classId, data) => {
  const response = await api.post(`/api/classes/${classId}/subjects`, data);
  return response.data;
};

export const updateClassSubject = async (classId, classSubjectId, data) => {
  const response = await api.put(
    `/api/classes/${classId}/subjects/${classSubjectId}`,
    data,
  );
  return response.data;
};

export const deleteClassSubject = async (classId, classSubjectId) => {
  const response = await api.delete(
    `/api/classes/${classId}/subjects/${classSubjectId}`,
  );
  return response.data;
};

export const getHomeroomTeacher = async (classId, academicYearId) => {
  const response = await api.get(
    `/api/classes/${classId}/homeroom-teacher`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};

export const setHomeroomTeacher = async (classId, data) => {
  const response = await api.put(
    `/api/classes/${classId}/homeroom-teacher`,
    data,
  );
  return response.data;
};

export const removeHomeroomTeacher = async (classId, academicYearId) => {
  const response = await api.delete(
    `/api/classes/${classId}/homeroom-teacher`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};
