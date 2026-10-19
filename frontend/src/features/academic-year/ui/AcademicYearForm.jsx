import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import FormHeader from "@/shared/layout/FormHeader";
import { useEffect } from "react";

const defaultFormValues = {
  start_year: "",
  end_year: "",
  odd_start_date: "",
  odd_end_date: "",
  even_start_date: "",
  even_end_date: "",
};

const AcademicYearForm = ({
  defaultValues = defaultFormValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Simpan tahun ajaran",
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultFormValues,
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  const submitHandler = (values) => {
    const payload = {
      start_year: Number(values.start_year),
      end_year: Number(values.end_year),
      terms: [
        {
          name: "Ganjil",
          start_date: values.odd_start_date,
          end_date: values.odd_end_date,
        },
        {
          name: "Genap",
          start_date: values.even_start_date,
          end_date: values.even_end_date,
        },
      ],
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Tahun Ajaran"
            description="Tentukan periode tahun ajaran yang akan digunakan."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="Tahun mulai"
            type="number"
            placeholder="Contoh: 2026"
            required
            error={errors.start_year?.message}
            {...register("start_year", {
              valueAsNumber: true,
              min: {
                value: 2000,
                message: "Tahun mulai tidak valid.",
              },
            })}
          />

          <Input
            label="Tahun selesai"
            type="number"
            placeholder="Contoh: 2027"
            required
            error={errors.end_year?.message}
            {...register("end_year", {
              valueAsNumber: true,
              min: {
                value: 2000,
                message: "Tahun selesai tidak valid.",
              },
              validate: (value, formValues) =>
                value === formValues.start_year + 1 ||
                "Tahun selesai harus satu tahun setelah tahun mulai.",
            })}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Semester Ganjil"
            description="Tentukan periode pelaksanaan semester ganjil."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="Tanggal mulai"
            type="date"
            required
            error={errors.odd_start_date?.message}
            {...register("odd_start_date")}
          />

          <Input
            label="Tanggal selesai"
            type="date"
            required
            error={errors.odd_end_date?.message}
            {...register("odd_end_date", {
              validate: (value, formValues) =>
                value >= formValues.odd_start_date ||
                "Tanggal selesai harus setelah tanggal mulai.",
            })}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Semester Genap"
            description="Tentukan periode pelaksanaan semester genap."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="Tanggal mulai"
            type="date"
            required
            error={errors.even_start_date?.message}
            {...register("even_start_date")}
          />

          <Input
            label="Tanggal selesai"
            type="date"
            required
            error={errors.even_end_date?.message}
            {...register("even_end_date", {
              validate: (value, formValues) =>
                value >= formValues.even_start_date ||
                "Tanggal selesai harus setelah tanggal mulai.",
            })}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          onClick={() => navigate(-1)}
          type="button"
          variant="outline"
          size="M"
          disabled={isSubmitting}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="M"
          icon={Save}
          loading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AcademicYearForm;
