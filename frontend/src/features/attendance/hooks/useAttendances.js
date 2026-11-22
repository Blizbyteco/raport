import { useQuery } from "@tanstack/react-query";

import { getAttendances } from "../api/attendanceApi";

const useAttendances = (classSubjectId, params = {}) => {
  return useQuery({
    queryKey: ["attendances", classSubjectId, params],
    queryFn: () => getAttendances(classSubjectId, params),
    enabled: Boolean(classSubjectId),
  });
};

export default useAttendances;
