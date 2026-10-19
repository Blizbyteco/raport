import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "../api/classApi";

const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });
};

export default useUpdateClass;
