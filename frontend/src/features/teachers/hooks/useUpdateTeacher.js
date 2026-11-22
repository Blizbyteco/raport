import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeacher } from "../api/teacherApi";

const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.id] });
    },
  });
};

export default useUpdateTeacher;
