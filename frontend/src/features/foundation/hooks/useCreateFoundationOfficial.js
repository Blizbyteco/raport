import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFoundationOfficial } from "../api/foundationOfficialApi";

const useCreateFoundationOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFoundationOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foundation-officials"] });
    },
  });
};

export default useCreateFoundationOfficial;
