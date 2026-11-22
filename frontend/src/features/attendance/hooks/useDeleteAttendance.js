import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAttendance } from "../api/attendanceApi";

const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    },
  });
};

export default useDeleteAttendance;
