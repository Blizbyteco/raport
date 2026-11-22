import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createStudent } from "../api/studentApi";

const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export default useCreateStudent;
