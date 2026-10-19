import { useQuery } from "@tanstack/react-query";
import { getClassSubjectStudents } from "../api/lessonApi";

const useClassSubjectStudents = (classSubjectId) => {
  return useQuery({
    queryKey: ["class-subject-students", classSubjectId],
    queryFn: () => getClassSubjectStudents(classSubjectId),
    enabled: Boolean(classSubjectId),
  });
};

export default useClassSubjectStudents;
