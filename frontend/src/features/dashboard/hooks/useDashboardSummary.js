import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "../api/dashboardApi";

const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });
};

export default useDashboardSummary;
