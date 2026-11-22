import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTeacher } from "../api/teacherApi";

const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export default useUpdateTeacher;
