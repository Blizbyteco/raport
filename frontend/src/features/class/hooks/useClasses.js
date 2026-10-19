import { useQuery } from "@tanstack/react-query";
import { getClasses } from "../api/classApi";

const useClasses = (search = "") => {
  return useQuery({
    queryKey: ["classes", search],
    queryFn: () => getClasses({ search }),
    staleTime: 1000 * 60 * 10,
  });
};

export default useClasses;
