import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api/teacherApi";

const useTeachers = (search = "") => {
  return useQuery({
    queryKey: ["teachers", search],
    queryFn: () => getTeachers({ search }),
  });
};

export default useTeachers;
