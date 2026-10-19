import { useQuery } from "@tanstack/react-query";

import { getAcademicYear } from "../api/academicApi";

const useAcademicYear = (id) => {
  return useQuery({
    queryKey: ["academic-years", id],
    queryFn: () => getAcademicYear(id),
    enabled: !!id,
  });
};

export default useAcademicYear;
