import { useQuery } from "@tanstack/react-query";

import { getExtracurriculars } from "../api/extracurricularApi";

const useExtracurriculars = (academicYearId) => {
  return useQuery({
    queryKey: ["extracurriculars", academicYearId ?? null],
    queryFn: () => getExtracurriculars(academicYearId),
  });
};

export default useExtracurriculars;
