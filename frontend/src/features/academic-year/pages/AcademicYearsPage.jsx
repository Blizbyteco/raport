import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import PageHeader from "@/shared/layout/PageHeader";

import AcademicYearBanner from "../ui/AcademicYearBanner";
import AcademicYearTable from "../ui/AcademicYearTable";

import useAcademicYears from "../hooks/useAcademicYears";
import useDeleteAcademicYear from "../hooks/useDeleteAcademicYear";

const AcademicYearsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAcademicYears();
  const deleteMutation = useDeleteAcademicYear();

  const academicYears = data?.data ?? [];

  const handleDelete = (academicYear) => {
    const confirmed = window.confirm(
      `Hapus tahun akademik ${academicYear.start_year}/${academicYear.end_year}?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(academicYear.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Tahun Akademik"
          description="Kelola periode akademik yang digunakan dalam sistem."
        />

        <Button icon={Plus} onClick={() => navigate("create")}>
          Tambah Tahun
        </Button>
      </div>

      <AcademicYearBanner academicYears={academicYears} />

      <AcademicYearTable
        data={academicYears}
        isLoading={isLoading}
        isError={isError}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AcademicYearsPage;
