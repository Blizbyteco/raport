import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFoundationOfficial } from "../api/foundationOfficialApi";

const useUpdateFoundationOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFoundationOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foundation-officials"] });
    },
  });
};

export default useUpdateFoundationOfficial;
