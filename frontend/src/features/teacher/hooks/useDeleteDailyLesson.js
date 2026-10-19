import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDailyLesson } from "../api/lessonApi";

const useDeleteDailyLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classSubjectId, dailyLessonId }) =>
      deleteDailyLesson(classSubjectId, dailyLessonId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-lessons", variables.classSubjectId],
      });
    },
  });
};

export default useDeleteDailyLesson;
