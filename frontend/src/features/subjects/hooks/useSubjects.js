import { useQuery } from "@tanstack/react-query";

import { getSubjects } from "../api/subjectApi";

const useSubjects = (search = "") => {
  return useQuery({
    queryKey: ["subjects", search],
    queryFn: () => getSubjects({ search }),
  });
};

export default useSubjects;
