import { useQuery } from "@tanstack/react-query";

import { getClassSubjects, getHomeroomTeacher } from "../api/placementApi";

export const useClassSubjects = (classId, academicYearId) => {
  return useQuery({
    queryKey: ["class-subjects", classId, academicYearId],
    queryFn: () => getClassSubjects(classId, academicYearId),
    enabled: Boolean(classId) && Boolean(academicYearId),
  });
};

export const useHomeroomTeacher = (classId, academicYearId) => {
  return useQuery({
    queryKey: ["homeroom-teacher", classId, academicYearId],
    queryFn: () => getHomeroomTeacher(classId, academicYearId),
    enabled: Boolean(classId) && Boolean(academicYearId),
  });
};
