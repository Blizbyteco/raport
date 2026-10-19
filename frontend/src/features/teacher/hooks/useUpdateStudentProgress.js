import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudentProgress } from "../api/lessonApi";

const useUpdateStudentProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentProgress,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-lesson-progress", variables.dailyLessonId],
      });

      queryClient.invalidateQueries({
        queryKey: ["daily-lesson"],
      });

      queryClient.invalidateQueries({
        queryKey: ["daily-lessons"],
      });
    },
  });
};

export default useUpdateStudentProgress;
