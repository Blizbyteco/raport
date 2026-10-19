import { useQuery } from "@tanstack/react-query";

import { getDailyLesson } from "../api/lessonApi";

const useDailyLesson = (classSubjectId, dailyLessonId) => {
  return useQuery({
    queryKey: ["daily-lesson", classSubjectId, dailyLessonId],
    queryFn: () => getDailyLesson(classSubjectId, dailyLessonId),
    enabled: Boolean(classSubjectId) && Boolean(dailyLessonId),
  });
};

export default useDailyLesson;
