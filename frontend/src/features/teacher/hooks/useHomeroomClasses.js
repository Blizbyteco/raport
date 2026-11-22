import { useQuery } from "@tanstack/react-query";

import { getHomeroomClasses } from "../api/teacherApi";

const useHomeroomClasses = () => {
  return useQuery({
    queryKey: ["teacher-homeroom-classes"],
    queryFn: getHomeroomClasses,
  });
};

export default useHomeroomClasses;
