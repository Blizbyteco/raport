import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import FormHeader from "@/shared/layout/FormHeader";
import setFormErrors from "@/shared/lib/setFormErrors";

import useCreateTeacher from "../hooks/useCreateTeacher";

const TeacherForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTeacher();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nip: "",
      username: "",
      full_name: "",
      password: "",
      is_active: true,
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate(
      {
        nip: values.nip.trim(),
        username: values.username.trim(),
        full_name: values.full_name.trim(),
        password: values.password,
        is_active: Boolean(values.is_active),
      },
      {
        onSuccess: () => navigate("/dashboard/teachers"),
        onError: (error) => setFormErrors(error, setError),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <FormHeader
            title="Data Pribadi"
            description="Informasi dasar mengenai guru."
          />
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Input
            label="NIP"
            placeholder="Contoh: 198501012010011001"
            required
            error={errors.nip?.message}
            {...register("nip", { required: "NIP wajib diisi" })}
          />

          <Input
            label="Nama lengkap"
            placeholder="Masukkan nama lengkap guru"
            required
            error={errors.full_name?.message}
            {...register("full_name", {
              required: "Nama lengkap wajib diisi",
            })}
          />

          <Input
            label="Username"
            placeholder="Contoh: nama.guru"
            required
            error={errors.username?.message}
            {...register("username", {
              required: "Username wajib diisi",
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            error={errors.password?.message}
            {...register("password", {
              required: "Password wajib diisi",
              minLength: {
                value: 8,
                message: "Password minimal 8 karakter",
              },
            })}
          />
        </div>

        <label className="flex items-center gap-2 px-6 pb-6 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            {...register("is_active")}
          />
          Akun aktif
        </label>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={() => navigate(-1)} type="button" variant="outline">
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          icon={Save}
          isLoading={createMutation.isPending}
          disabled={createMutation.isPending}
        >
          Simpan guru
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;
