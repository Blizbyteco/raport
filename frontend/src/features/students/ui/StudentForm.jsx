import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Select from "@/shared/ui/form/Select";
import FormHeader from "@/shared/layout/FormHeader";
import setFormErrors from "@/shared/lib/setFormErrors";

import useCreateStudent from "../hooks/useCreateStudent";

const StudentForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateStudent();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nisn: "",
      full_name: "",
      gender: "",
      parent_name: "",
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate(
      {
        nisn: values.nisn.trim(),
        full_name: values.full_name.trim(),
        gender: values.gender || null,
        parent_name: values.parent_name.trim() || null,
      },
      {
        onSuccess: () => navigate("/dashboard/students"),
        onError: (error) => setFormErrors(error, setError),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Data Pribadi"
            description="Informasi dasar mengenai siswa."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="NISN"
            id="nisn"
            placeholder="Contoh: 20250101"
            required
            error={errors.nisn?.message}
            {...register("nisn", { required: "NISN wajib diisi" })}
          />

          <Input
            label="Nama lengkap"
            id="full_name"
            placeholder="Masukkan nama lengkap siswa"
            required
            error={errors.full_name?.message}
            {...register("full_name", {
              required: "Nama lengkap wajib diisi",
            })}
          />

          <Select
            label="Jenis kelamin"
            id="gender"
            defaultValue=""
            {...register("gender")}
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Select>

          <Input
            label="Nama Wali / Orang tua"
            id="parent_name"
            placeholder="Masukkan nama lengkap"
            error={errors.parent_name?.message}
            {...register("parent_name")}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          onClick={() => navigate(-1)}
          type="button"
          variant="outline"
          size="M"
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="M"
          icon={Save}
          isLoading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          Simpan siswa
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
