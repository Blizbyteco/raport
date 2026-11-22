import { useQuery } from "@tanstack/react-query";

import { getExtracurricular } from "../api/extracurricularApi";

const useExtracurricular = (id) => {
  return useQuery({
    queryKey: ["extracurriculars", "detail", id],
    queryFn: () => getExtracurricular(id),
    enabled: Boolean(id),
  });
};

export default useExtracurricular;
