import { useMutation } from "@tanstack/react-query";
import { downloadClassroomReport } from "../api/teacherApi";

const useDownloadClassroomReport = () => {
  return useMutation({
    mutationFn: downloadClassroomReport,

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
