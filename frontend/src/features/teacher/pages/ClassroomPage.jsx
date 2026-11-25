import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  History,
  Plus,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Breadcrumb from "@/shared/ui/navigation/Breadcrumb";
import ClassBanner from "../ui/ClassBanner";
import LearningCard from "../ui/LearningCard";
import useDailyLessons from "../hooks/useDailyLessons";
import useDeleteDailyLesson from "../hooks/useDeleteDailyLesson";

const ClassroomPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();
  const [deletingLessonId, setDeletingLessonId] = useState(null);

  const { data, isLoading, isError } = useDailyLessons(classSubjectId);
  const deleteLesson = useDeleteDailyLesson();

  const meta = data?.meta ?? {};
  const histories = data?.data ?? [];

  const openCreateProgress = () =>
    navigate(`/teacher/class/${classSubjectId}/progress/create`);

  const handleDeleteLesson = (lesson) => {
    if (!window.confirm(`Hapus pembelajaran "${lesson.material}"?`)) return;

    setDeletingLessonId(lesson.id);

    deleteLesson.mutate(
      { classSubjectId, dailyLessonId: lesson.id },
      { onSettled: () => setDeletingLessonId(null) },
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ChevronLeft}
        onClick={() => navigate("/teacher")}
        className="-ml-2"
      >
        Kembali
      </Button>

      <Breadcrumb
        items={[
          { label: "Beranda", path: "/teacher" },
          { label: meta.classroom?.name ?? "Kelas" },
        ]}
      />

      <ClassBanner data={meta} />

      <div className="flex flex-wrap gap-2">
        <Button icon={Plus} onClick={openCreateProgress}>
          Catat Pembelajaran
        </Button>

        <Button
          variant="outline"
          icon={ClipboardCheck}
          onClick={() =>
            navigate(`/teacher/class/${classSubjectId}/attendance/new`)
          }
        >
          Catat Presensi
        </Button>

        <Button
          variant="outline"
          icon={History}
          onClick={() =>
            navigate(`/teacher/class/${classSubjectId}/attendance/history`)
          }
        >
          Riwayat Presensi
        </Button>

        <Button
          variant="outline"
          icon={FileText}
          onClick={() =>
            navigate(`/teacher/class/${classSubjectId}/evaluation`)
          }
        >
          Evaluasi & Laporan
        </Button>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold text-foreground">Sesi Pembelajaran</h2>
          <p className="mt-1 text-sm text-muted">
            Catat materi, nilai pemahaman, dan catatan siswa untuk setiap sesi.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted">Memuat sesi pembelajaran...</p>
        ) : isError ? (
          <p className="text-sm text-danger">Gagal memuat sesi pembelajaran.</p>
        ) : histories.length > 0 ? (
          <div className="space-y-3">
            {histories.map((history) => (
              <LearningCard
                key={history.id}
                {...history}
                onClick={() =>
                  navigate(
                    `/teacher/class/${classSubjectId}/progress/${history.id}`,
                  )
                }
                onDelete={() => handleDeleteLesson(history)}
                isDeleting={deletingLessonId === history.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background text-muted">
              <BookOpen className="size-5" />
            </div>

            <h3 className="mt-4 font-bold text-card-foreground">
              Belum ada sesi pembelajaran
            </h3>

            <p className="mt-1 text-sm text-muted">
              Catat sesi pertama untuk mulai mengisi progress siswa.
            </p>

            <Button className="mt-4" icon={Plus} onClick={openCreateProgress}>
              Catat Pembelajaran
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ClassroomPage;
