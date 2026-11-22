import { useMutation } from "@tanstack/react-query";
import { downloadStudentReport } from "../api/teacherApi";

const useDownloadStudentReport = () => {
  return useMutation({
    mutationFn: downloadStudentReport,

    onSuccess: (response) => {
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "rapor-siswa.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export default useDownloadStudentReport;
