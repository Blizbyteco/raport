import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAcademicYear } from "../api/academicApi";

const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAcademicYear,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academic-years"],
      });
    },
  });
};

export default useCreateAcademicYear;
