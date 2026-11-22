import api from "@/shared/api/Axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};
