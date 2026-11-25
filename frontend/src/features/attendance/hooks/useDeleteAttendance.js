import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/shared/ui/feedback/toast";

import { deleteAttendance } from "../api/attendanceApi";

const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });

      toast.success("Absensi berhasil dihapus.");
    },
    onError: (error) => {
      toast.danger(error.response?.data?.message ?? "Gagal menghapus absensi.");
    },
  });
};

export default useDeleteAttendance;
