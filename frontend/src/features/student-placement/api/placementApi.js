import api from "@/shared/api/Axios";

export const getClassStudents = async (classId, academicYearId) => {
  const response = await api.get(`/api/classes/${classId}/students`, {
    params: { academic_year_id: academicYearId },
  });
  return response.data;
};

export const addStudentsToClass = async (classId, data) => {
  const response = await api.post(`/api/classes/${classId}/students`, data);
  return response.data;
};

export const removeStudentFromClass = async (
  classId,
  studentId,
  academicYearId,
) => {
  const response = await api.delete(
    `/api/classes/${classId}/students/${studentId}`,
    { params: { academic_year_id: academicYearId } },
  );
  return response.data;
};
