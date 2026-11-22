import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activateAcademicYear } from "../api/academicApi";

const useActivateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
    },
  });
};

export default useActivateAcademicYear;
