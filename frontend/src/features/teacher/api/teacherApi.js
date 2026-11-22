import api from "@/shared/api/Axios";

export const getTeacherClasses = async () => {
  const response = await api.get("/api/teacher/classes");
  return response.data;
};

export const getHomeroomClasses = async () => {
  const response = await api.get("/api/teacher/homeroom-classes");
  return response.data;
};

export const getTeacherClassDetail = async (classId) => {
  const response = await api.get(`/api/teacher/classes/${classId}`);
  return response.data;
};

export const getTeacherClassProgress = async (classId) => {
  const response = await api.get(`/api/teacher/classes/${classId}/progress`);
  return response.data;
};

export const getClassSubjectEvaluation = async (classSubjectId) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/evaluation`,
  );
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
