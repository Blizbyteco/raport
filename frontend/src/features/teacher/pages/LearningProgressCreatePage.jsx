import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Textarea from "@/shared/ui/form/Textarea";
import PageHeader from "@/shared/layout/PageHeader";
import FormHeader from "@/shared/layout/FormHeader";

import useClassSubjectStudents from "../hooks/useClassSubjectStudents";
import useCreateDailyLesson from "../hooks/useCreateDailyLesson";

const LearningProgressCreatePage = () => {
  const { classSubjectId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lesson_date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      progress: [],
    },
  });

  const { data, isLoading } = useClassSubjectStudents(classSubjectId);

  const createMutation = useCreateDailyLesson();

  const students = data?.data ?? [];

  const onSubmit = (formData) => {
    const payload = {
      lesson_date: formData.lesson_date,
      title: formData.title,
      description: formData.description || null,
      progress: students.map((student, index) => ({
        student_id: student.id,
        score: Number(formData.progress?.[index]?.score),
        teacher_note: formData.progress?.[index]?.teacher_note || null,
      })),
    };

    createMutation.mutate(
      {
        classSubjectId,
        data: payload,
      },
      {
        onSuccess: () => {
          navigate(`/teacher/class/${classSubjectId}`);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Catat Pembelajaran"
        description="Catat materi dan tingkat pemahaman setiap siswa."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <FormHeader title="Informasi Pembelajaran" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tanggal"
                type="date"
                {...register("lesson_date", {
                  required: "Tanggal wajib diisi",
                })}
                error={errors.lesson_date?.message}
              />

              <Input
                label="Materi"
                type="text"
                placeholder="Contoh: Persamaan linear"
                {...register("title", {
                  required: "Materi wajib diisi",
                  maxLength: {
                    value: 150,
                    message: "Materi maksimal 150 karakter",
                  },
                })}
                error={errors.title?.message}
              />
            </div>

            <Textarea
              label="Deskripsi"
              placeholder="Tambahkan catatan mengenai pembelajaran hari ini..."
              {...register("description")}
            />
          </div>
        </section>

        <section>
          <div className="bg-card rounded-xl border border-border space-y-4">
            <div className="p-6 border-b border-border">
              <FormHeader
                title="Perkembangan Siswa"
                description="Nilai 1–100 berdasarkan tingkat pemahaman siswa."
              />
            </div>

            {students.map((student, index) => (
              <div
                key={student.id}
                className="p-6 border-b border-border space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-dark">
                      {student.name
                        ?.toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </h3>

                    <p className="text-xs text-muted mt-1">{student.nis}</p>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Input
                      label="Pemahaman"
                      type="number"
                      min="1"
                      max="100"
                      {...register(`progress.${index}.score`, {
                        required: "Nilai wajib diisi",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "Nilai minimal 1",
                        },
                        max: {
                          value: 100,
                          message: "Nilai maksimal 100",
                        },
                      })}
                      error={errors.progress?.[index]?.score?.message}
                    />
                  </div>
                </div>

                <Input
                  placeholder="Catatan untuk siswa (opsional)"
                  {...register(`progress.${index}.teacher_note`)}
                />
              </div>
            ))}

            {isLoading && (
              <div className="p-6 text-sm text-muted">Memuat data siswa...</div>
            )}

            {!isLoading && students.length === 0 && (
              <div className="p-6 text-sm text-muted">
                Tidak ada siswa dalam kelas ini.
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="M"
            onClick={() => navigate(`/teacher/classrooms/${classSubjectId}`)}
          >
            Batal
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="M"
            icon={Save}
            loading={createMutation.isPending}
            disabled={
              isLoading || students.length === 0 || createMutation.isPending
            }
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LearningProgressCreatePage;
