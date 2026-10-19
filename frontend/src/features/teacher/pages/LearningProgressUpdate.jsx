import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Textarea from "@/shared/ui/form/Textarea";
import PageHeader from "@/shared/layout/PageHeader";
import FormHeader from "@/shared/layout/FormHeader";

import useDailyLesson from "../hooks/useDailyLesson";
import useDailyLessonProgress from "../hooks/useDailyLessonProgress";
import useUpdateDailyLesson from "../hooks/useUpdateDailyLesson";
import useUpdateStudentProgress from "../hooks/useUpdateStudentProgress";

const LearningProgressUpdatePage = () => {
  const { classSubjectId, dailyLessonId } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: lessonData, isLoading: isLessonLoading } = useDailyLesson(
    classSubjectId,
    dailyLessonId,
  );

  const { data: progressData, isLoading: isProgressLoading } =
    useDailyLessonProgress(dailyLessonId);

  const updateLessonMutation = useUpdateDailyLesson();

  const updateProgressMutation = useUpdateStudentProgress();

  const lesson = lessonData?.data;
  const progress = progressData?.data ?? [];

  useEffect(() => {
    if (!lesson) return;

    reset({
      lesson_date: lesson.lesson_date,
      title: lesson.title,
      description: lesson.description ?? "",
    });
  }, [lesson, reset]);

  const handleUpdateLesson = (formData) => {
    updateLessonMutation.mutate({
      classSubjectId,
      dailyLessonId,
      lesson_date: formData.lesson_date,
      title: formData.title,
      description: formData.description || null,
    });
  };

  const handleUpdateProgress = (studentId, data) => {
    updateProgressMutation.mutate({
      dailyLessonId,
      studentId,
      score: Number(data.score),
      teacher_note: data.teacher_note || null,
    });
  };

  if (isLessonLoading || isProgressLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-muted">Memuat data pembelajaran...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Edit Pembelajaran"
        description="Perbarui informasi pembelajaran dan perkembangan siswa."
      />

      {/* Informasi Pembelajaran */}
      <section className="space-y-6">
        <form onSubmit={handleSubmit(handleUpdateLesson)}>
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

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="M"
                icon={Save}
                loading={updateLessonMutation.isPending}
                disabled={updateLessonMutation.isPending}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Progress Siswa */}
      <section>
        <div className="bg-card rounded-xl border border-border space-y-4">
          <div className="p-6 border-b border-border">
            <FormHeader
              title="Perkembangan Siswa"
              description="Perbarui nilai dan catatan perkembangan siswa."
            />
          </div>

          {progress.map((item) => (
            <StudentProgressForm
              key={item.id}
              item={item}
              onSubmit={handleUpdateProgress}
              isPending={updateProgressMutation.isPending}
            />
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          type="button"
          size="M"
          onClick={() => navigate(`/teacher/class/${classSubjectId}`)}
        >
          Kembali
        </Button>
      </div>
    </div>
  );
};

const StudentProgressForm = ({ item, onSubmit, isPending }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      score: item.score,
      teacher_note: item.teacher_note ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(item.student_id, data))}
      className="p-6 border-b border-border space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-dark">
            {item.student?.full_name
              ?.toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>

          <p className="text-xs text-muted mt-1">{item.student?.nisn}</p>
        </div>

        <div className="w-full sm:w-auto">
          <Input
            label="Pemahaman"
            type="number"
            min="1"
            max="100"
            {...register("score", {
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
            error={errors.score?.message}
          />
        </div>
      </div>

      <Input
        placeholder="Catatan untuk siswa (opsional)"
        {...register("teacher_note")}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          size="M"
          loading={isPending}
          disabled={isPending}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};

export default LearningProgressUpdatePage;
