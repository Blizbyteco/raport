import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import PageHeader from "@/shared/layout/PageHeader";

import AcademicYearBanner from "../ui/AcademicYearBanner";
import AcademicYearTable from "../ui/AcademicYearTable";

import useAcademicYears from "../hooks/useAcademicYears";

const AcademicYearsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAcademicYears();

  const academicYears = data?.data ?? [];

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
      />
    </div>
  );
};

export default AcademicYearsPage;
