import { useQuery } from "@tanstack/react-query";

import { getDailyLessonProgress } from "../api/lessonApi";

const useDailyLessonProgress = (dailyLessonId) => {
  return useQuery({
    queryKey: ["daily-lesson-progress", dailyLessonId],
    queryFn: () => getDailyLessonProgress(dailyLessonId),
    enabled: Boolean(dailyLessonId),
  });
};

export default useDailyLessonProgress;
