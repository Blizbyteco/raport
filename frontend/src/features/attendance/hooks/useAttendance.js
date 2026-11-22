import { useQuery } from "@tanstack/react-query";

import { getAttendance } from "../api/attendanceApi";

const useAttendance = (id) => {
  return useQuery({
    queryKey: ["attendances", "detail", id],
    queryFn: () => getAttendance(id),
    enabled: Boolean(id),
  });
};

export default useAttendance;
