import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeacher } from "../api/teacherApi";

const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export default useCreateTeacher;
