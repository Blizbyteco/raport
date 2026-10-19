import { useNavigate } from "react-router";

import PageHeader from "@/shared/layout/PageHeader";
import AcademicYearForm from "../ui/AcademicYearForm";
import useCreateAcademicYear from "../hooks/useCreateAcademicYear";

const CreateAcademicYearPage = () => {
  const navigate = useNavigate();

  const { mutate: createAcademicYear, isPending } = useCreateAcademicYear();

  const handleSubmit = (data) => {
    createAcademicYear(data, {
      onSuccess: () => {
        navigate("/dashboard/academic-years");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Tahun Akademik"
        description="Tambah periode akademik yang digunakan dalam sistem."
      />

      <AcademicYearForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
};

export default CreateAcademicYearPage;
