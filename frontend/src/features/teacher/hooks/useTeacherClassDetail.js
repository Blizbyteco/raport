import { useQuery } from "@tanstack/react-query";

import { getTeacherClassDetail } from "../api/teacherApi";

const useTeacherClassDetail = (classId) => {
  return useQuery({
    queryKey: ["teacher-class-detail", classId],
    queryFn: () => getTeacherClassDetail(classId),
    enabled: Boolean(classId),
  });
};

export default useTeacherClassDetail;
