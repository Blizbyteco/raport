import { useQuery } from "@tanstack/react-query";

import { getStudent } from "../api/studentApi";

const useStudent = (id) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => getStudent(id),
    enabled: Boolean(id),
  });
};

export default useStudent;
