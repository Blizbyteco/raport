import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExtracurricular } from "../api/extracurricularApi";

const useDeleteExtracurricular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExtracurricular,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
  });
};

export default useDeleteExtracurricular;
