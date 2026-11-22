import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    },
  });
};

export default useUpdateAttendance;
