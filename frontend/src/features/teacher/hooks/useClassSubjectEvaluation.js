import { useQuery } from "@tanstack/react-query";

import { getClassSubjectEvaluation } from "../api/teacherApi";

const useClassSubjectEvaluation = (classSubjectId) => {
  return useQuery({
    queryKey: ["class-subject-evaluation", classSubjectId],
    queryFn: () => getClassSubjectEvaluation(classSubjectId),
    enabled: Boolean(classSubjectId),
  });
};

export default useClassSubjectEvaluation;
