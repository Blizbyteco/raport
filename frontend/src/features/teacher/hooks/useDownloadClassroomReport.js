import { useMutation } from "@tanstack/react-query";
import api from "@/shared/api/Axios";

const useDownloadClassroomReport = () => {
  return useMutation({
    mutationFn: (variables) => {
      const request =
        variables && typeof variables === "object"
          ? variables
          : { classSubjectId: variables };

      return api.get(
        `/api/class-subjects/${request.classSubjectId}/report/pdf`,
        {
          responseType: "blob",
          params: request.params,
        },
      );
    },

    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "laporan-perkembangan-siswa.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export default useDownloadClassroomReport;
