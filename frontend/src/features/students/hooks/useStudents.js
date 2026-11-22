import { useQuery } from "@tanstack/react-query";

import { getStudents } from "../api/studentApi";

const useStudents = (search = "") => {
  return useQuery({
    queryKey: ["students", search],
    queryFn: () => getStudents({ search }),
  });
};

export default useStudents;
