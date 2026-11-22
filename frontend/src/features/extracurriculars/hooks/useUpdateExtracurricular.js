import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateExtracurricular } from "../api/extracurricularApi";

const useUpdateExtracurricular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExtracurricular,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
  });
};

export default useUpdateExtracurricular;
