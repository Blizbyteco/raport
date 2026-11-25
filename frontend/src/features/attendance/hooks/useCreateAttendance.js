import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

import { createAttendance } from "../api/attendanceApi";

const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", variables.classSubjectId],
      });

      toast.success("Absensi berhasil disimpan.");
    },
    onError: (error) => {
      toast.danger(error.response?.data?.message ?? "Gagal menyimpan absensi.");
    },
  });
};

export default useCreateAttendance;
