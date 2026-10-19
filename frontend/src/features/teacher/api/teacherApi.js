import api from "@/shared/api/Axios";

export const getTeacherClasses = async () => {
  const response = await api.get("/api/teacher/classes");
  return response.data;
};

export const downloadClassroomReport = async (classSubjectId) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/report/pdf`,
    {
      responseType: "blob",
    },
  );

  return response;
};

export const downloadStudentReport = async (studentId) => {
  const response = await api.get(`/api/students/${studentId}/report/pdf`, {
    responseType: "blob",
  });
  return response;
};
