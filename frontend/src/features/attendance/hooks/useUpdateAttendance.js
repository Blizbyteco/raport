import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

import { updateAttendance } from "../api/attendanceApi";

const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      queryClient.invalidateQueries({
        queryKey: ["attendances", "detail", variables.id],
      });

      toast.success("Absensi berhasil diperbarui.");
    },
    onError: (error) => {
      toast.danger(
        error.response?.data?.message ?? "Gagal memperbarui absensi.",
      );
    },
  });
};

export default useUpdateAttendance;
