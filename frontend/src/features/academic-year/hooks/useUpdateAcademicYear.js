import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAcademicYear } from "../api/academicApi";

const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAcademicYear(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["academic-years"],
      });

      queryClient.invalidateQueries({
        queryKey: ["academic-years", variables.id],
      });
    },
  });
};

export default useUpdateAcademicYear;
