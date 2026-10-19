import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSubject } from "../api/subjectApi";

const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },
  });
};

export default useCreateSubject;
