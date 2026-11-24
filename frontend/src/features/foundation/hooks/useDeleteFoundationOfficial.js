import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFoundationOfficial } from "../api/foundationOfficialApi";

const useDeleteFoundationOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFoundationOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foundation-officials"] });
    },
  });
};

export default useDeleteFoundationOfficial;
