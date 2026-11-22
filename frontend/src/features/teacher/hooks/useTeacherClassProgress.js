import { useQuery } from "@tanstack/react-query";

import { getTeacherClassProgress } from "../api/teacherApi";

const useTeacherClassProgress = (classId) => {
  return useQuery({
    queryKey: ["teacher-class-progress", classId],
    queryFn: () => getTeacherClassProgress(classId),
    enabled: Boolean(classId),
  });
};

export default useTeacherClassProgress;
