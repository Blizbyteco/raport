import { useQuery } from "@tanstack/react-query";

import { getClass } from "../api/classApi";

const useClass = (id) => {
  return useQuery({
    queryKey: ["classes", "detail", id],
    queryFn: () => getClass(id),
    enabled: Boolean(id),
  });
};

export default useClass;
