import { useQuery } from "@tanstack/react-query";

import { getSubject } from "../api/subjectApi";

const useSubject = (id) => {
  return useQuery({
    queryKey: ["subjects", "detail", id],
    queryFn: () => getSubject(id),
    enabled: Boolean(id),
  });
};

export default useSubject;
