import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api/teacherApi";

const useTeachers = (search = "") => {
  return useQuery({
    queryKey: ["teachers", "list", search],
    queryFn: () => getTeachers({ search, per_page: 200 }),
  });
};

export default useTeachers;
