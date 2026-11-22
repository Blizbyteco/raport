import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createExtracurricular } from "../api/extracurricularApi";

const useCreateExtracurricular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExtracurricular,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
  });
};

export default useCreateExtracurricular;
