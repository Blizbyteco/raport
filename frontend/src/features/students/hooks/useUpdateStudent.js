import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStudent } from "../api/studentApi";

const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
    },
  });
};

export default useUpdateStudent;
