import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import PageHeader from "@/shared/layout/PageHeader";

import AcademicYearForm from "../ui/AcademicYearForm";
import useAcademicYear from "../hooks/useAcademicYear";
import useUpdateAcademicYear from "../hooks/useUpdateAcademicYear";

const EditAcademicYearPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAcademicYear(id);

  const {
    mutate: updateAcademicYear,
    isPending,
    error,
  } = useUpdateAcademicYear();

  const academicYear = data?.data;

  const defaultValues = useMemo(() => {
    if (!academicYear) {
      return undefined;
    }

    const ganjil = academicYear.terms.find((term) => term.name === "Ganjil");

    const genap = academicYear.terms.find((term) => term.name === "Genap");

    return {
      start_year: academicYear.start_year,
      end_year: academicYear.end_year,

      odd_start_date: ganjil?.start_date ?? "",
      odd_end_date: ganjil?.end_date ?? "",

      even_start_date: genap?.start_date ?? "",
      even_end_date: genap?.end_date ?? "",
    };
  }, [academicYear]);

  const handleSubmit = (formData) => {
    updateAcademicYear(
      {
        id,
        data: formData,
      },
      {
        onSuccess: () => {
          navigate("/dashboard/academic-years");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Tahun Akademik"
          description="Ubah periode akademik yang digunakan dalam sistem."
        />

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted">Memuat data tahun akademik...</p>
        </div>
      </div>
    );
  }

  if (isError || !academicYear) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Edit Tahun Akademik"
          description="Ubah periode akademik yang digunakan dalam sistem."
        />

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-destructive">
            Data tahun akademik gagal dimuat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Tahun Akademik"
        description="Ubah periode akademik yang digunakan dalam sistem."
      />

      {error && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
          Gagal memperbarui tahun akademik.
        </div>
      )}

      <AcademicYearForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        submitLabel="Simpan perubahan"
      />
    </div>
  );
};

export default EditAcademicYearPage;
