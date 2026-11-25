import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

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

      toast.success("Pembelajaran berhasil dihapus.");
    },

    onError: (error) => {
      toast.danger(
        error.response?.data?.message ?? "Gagal menghapus pembelajaran.",
      );
    },
  });
};

export default useDeleteDailyLesson;
