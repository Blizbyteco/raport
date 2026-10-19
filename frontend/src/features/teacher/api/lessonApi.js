import api from "@/shared/api/Axios";

// Daily Lessons
export const getDailyLessons = async (classSubjectId, params = {}) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/lessons`,
    { params },
  );

  return response.data;
};

export const getDailyLesson = async (classSubjectId, dailyLessonId) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/lessons/${dailyLessonId}`,
  );

  return response.data;
};

// Create lesson + seluruh progress siswa
export const createDailyLesson = async (classSubjectId, data) => {
  const response = await api.post(
    `/api/class-subjects/${classSubjectId}/lessons`,
    data,
  );

  return response.data;
};

// Update informasi lesson
export const updateDailyLesson = async ({
  classSubjectId,
  dailyLessonId,
  ...data
}) => {
  const response = await api.put(
    `/api/class-subjects/${classSubjectId}/lessons/${dailyLessonId}`,
    data,
  );

  return response.data;
};

export const deleteDailyLesson = async (classSubjectId, dailyLessonId) => {
  const response = await api.delete(
    `/api/class-subjects/${classSubjectId}/lessons/${dailyLessonId}`,
  );

  return response.data;
};

// Students dalam classroom
export const getClassSubjectStudents = async (classSubjectId) => {
  const response = await api.get(
    `/api/class-subjects/${classSubjectId}/students`,
  );

  return response.data;
};

// Student Daily Progress
export const getDailyLessonProgress = async (dailyLessonId) => {
  const response = await api.get(`/api/lessons/${dailyLessonId}/progress`);

  return response.data;
};

// Update progress satu siswa
export const updateStudentProgress = async ({
  dailyLessonId,
  studentId,
  ...data
}) => {
  const response = await api.put(
    `/api/lessons/${dailyLessonId}/progress/${studentId}`,
    data,
  );

  return response.data;
};
