import { useQuery } from "@tanstack/react-query";

import { getDailyLessons } from "../api/lessonApi";

const useDailyLessons = (classSubjectId, params = {}) => {
  return useQuery({
    queryKey: ["daily-lessons", classSubjectId, params],
    queryFn: () => getDailyLessons(classSubjectId, params),
    enabled: Boolean(classSubjectId),
  });
};

export default useDailyLessons;
