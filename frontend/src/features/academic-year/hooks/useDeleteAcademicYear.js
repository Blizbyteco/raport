import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAcademicYear } from "@/features/academic-year/api/academicApi";

const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAcademicYear,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["academic-years"],
      });
    },
  });
};

export default useDeleteAcademicYear;
