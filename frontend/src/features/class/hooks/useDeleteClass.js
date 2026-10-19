import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClass } from "../api/classApi";

const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });
};

export default useDeleteClass;
