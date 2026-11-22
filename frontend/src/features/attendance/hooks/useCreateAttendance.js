import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAttendance } from "../api/attendanceApi";

const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances", variables.classSubjectId],
      });
    },
  });
};

export default useCreateAttendance;
