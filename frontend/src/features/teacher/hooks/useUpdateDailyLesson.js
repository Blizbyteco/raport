import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDailyLesson } from "../api/lessonApi";

const useUpdateDailyLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDailyLesson,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-lessons", variables.classSubjectId],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "daily-lesson",
          variables.classSubjectId,
          variables.dailyLessonId,
        ],
      });
    },
  });
};

export default useUpdateDailyLesson;
