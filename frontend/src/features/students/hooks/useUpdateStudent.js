import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudent } from "../api/studentApi";

const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export default useUpdateStudent;
