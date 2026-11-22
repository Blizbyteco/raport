import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeacher } from "../api/teacherApi";

const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export default useDeleteTeacher;
