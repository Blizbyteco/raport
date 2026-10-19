import { useQuery } from "@tanstack/react-query";

import { getAcademicYears } from "../api/academicApi";

const useAcademicYears = () => {
  return useQuery({
    queryKey: ["academic-years"],
    queryFn: getAcademicYears,
  });
};

export default useAcademicYears;
