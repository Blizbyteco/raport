import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

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

      toast.success("Progress siswa berhasil diperbarui.");
    },

    onError: (error) => {
      toast.danger(
        error.response?.data?.message ?? "Gagal memperbarui progress siswa.",
      );
    },
  });
};

export default useUpdateStudentProgress;
