import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSubject } from "../api/subjectApi";

const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },
  });
};

export default useUpdateSubject;
