import { useQuery } from "@tanstack/react-query";

import { getTeacherClasses } from "../api/teacherApi";

const useTeacherClasses = () => {
  return useQuery({
    queryKey: ["teacher-classes"],
    queryFn: getTeacherClasses,
  });
};

export default useTeacherClasses;
