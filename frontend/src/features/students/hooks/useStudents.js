import { useQuery } from "@tanstack/react-query";

import { getStudents } from "../api/studentApi";

const useStudents = (search = "") => {
  return useQuery({
    queryKey: ["students", "list", search],
    queryFn: () => getStudents({ search, per_page: 200 }),
  });
};

export default useStudents;
