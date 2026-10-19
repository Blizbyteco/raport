import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass } from "../api/classApi";

const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });
    },
  });
};

export default useCreateClass;
