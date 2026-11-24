import { useQuery } from "@tanstack/react-query";

import { getFoundationOfficials } from "../api/foundationOfficialApi";

const useFoundationOfficials = () => {
  return useQuery({
    queryKey: ["foundation-officials"],
    queryFn: getFoundationOfficials,
  });
};

export default useFoundationOfficials;
