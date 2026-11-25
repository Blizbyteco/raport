import axios from "axios";
import { toast } from "@/shared/ui/feedback/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isAuthRequest =
      url.includes("/login") ||
      url.includes("/api/logout") ||
      url.includes("/api/user");

    if (status === 401 && !isAuthRequest) {
      window.dispatchEvent(new Event("auth:expired"));
      toast.warning("Sesi Anda berakhir. Silakan masuk untuk melanjutkan.");
    }

    if (status === 403 && error.response?.data?.message) {
      toast.danger(error.response.data.message);
    }

    return Promise.reject(error);
  },
);

export default api;
