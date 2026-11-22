import { useQuery } from "@tanstack/react-query";

import {
  getExtracurricularStudents,
  getExtracurricularTeachers,
} from "../api/extracurricularApi";

export const useExtracurricularTeachers = (
  extracurricularId,
  academicYearId,
) =>
  useQuery({
    queryKey: ["extracurricular-teachers", extracurricularId, academicYearId],
    queryFn: () =>
      getExtracurricularTeachers(extracurricularId, academicYearId),
    enabled: Boolean(extracurricularId) && Boolean(academicYearId),
  });

export const useExtracurricularStudents = (
  extracurricularId,
  academicYearId,
) =>
  useQuery({
    queryKey: ["extracurricular-students", extracurricularId, academicYearId],
    queryFn: () =>
      getExtracurricularStudents(extracurricularId, academicYearId),
    enabled: Boolean(extracurricularId) && Boolean(academicYearId),
  });
