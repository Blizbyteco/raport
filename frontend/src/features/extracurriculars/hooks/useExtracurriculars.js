import { useQuery } from "@tanstack/react-query";

import { getExtracurriculars } from "../api/extracurricularApi";

const useExtracurriculars = () => {
  return useQuery({
    queryKey: ["extracurriculars"],
    queryFn: getExtracurriculars,
  });
};

export default useExtracurriculars;
