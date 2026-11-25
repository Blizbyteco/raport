import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

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

      toast.success("Pembelajaran berhasil diperbarui.");
    },

    onError: (error) => {
      toast.danger(
        error.response?.data?.message ?? "Gagal memperbarui pembelajaran.",
      );
    },
  });
};

export default useUpdateDailyLesson;
