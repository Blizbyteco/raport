import { useQuery } from "@tanstack/react-query";

import { getClassStudents } from "../api/placementApi";

const useClassStudents = (classId, academicYearId) => {
  return useQuery({
    queryKey: ["class-students", classId, academicYearId],
    queryFn: () => getClassStudents(classId, academicYearId),
    enabled: Boolean(classId) && Boolean(academicYearId),
  });
};

export default useClassStudents;
