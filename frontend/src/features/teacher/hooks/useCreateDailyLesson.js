import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDailyLesson } from "../api/lessonApi";

const useCreateDailyLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classSubjectId, data }) =>
      createDailyLesson(classSubjectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-lessons", variables.classSubjectId],
      });
    },
  });
};

export default useCreateDailyLesson;
