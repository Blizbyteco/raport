import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSubject } from "../api/subjectApi";

const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },
  });
};

export default useDeleteSubject;
