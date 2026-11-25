import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

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

      toast.success("Sesi pembelajaran dan progress siswa berhasil disimpan.");
    },

    onError: (error) => {
      toast.danger(
        error.response?.data?.message ?? "Gagal menyimpan sesi pembelajaran.",
      );
    },
  });
};

export default useCreateDailyLesson;
