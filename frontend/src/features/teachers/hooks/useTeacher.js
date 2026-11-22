import { useQuery } from "@tanstack/react-query";

import { getTeacher } from "../api/teacherApi";

const useTeacher = (id) => {
  return useQuery({
    queryKey: ["teachers", "detail", id],
    queryFn: () => getTeacher(id),
    enabled: Boolean(id),
  });
};

export default useTeacher;
