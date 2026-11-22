import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ClipboardCheck, FileText } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import ClassBanner from "../ui/ClassBanner";
import LearningCard from "../ui/LearningCard";
import useDailyLessons from "../hooks/useDailyLessons";
import useDeleteDailyLesson from "../hooks/useDeleteDailyLesson";
import useDownloadClassroomReport from "../hooks/useDownloadClassroomReport";

const ClassroomPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();
  const [deletingLessonId, setDeletingLessonId] = useState(null);

  const { data, isLoading, isError } = useDailyLessons(classSubjectId);
  const downloadReport = useDownloadClassroomReport();
  const deleteLesson = useDeleteDailyLesson();

  const meta = data?.meta ?? {};
  const histories = data?.data ?? [];

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
      <ClassBanner data={meta} />

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Riwayat Pembelajaran
          </h2>
          <p className="mt-1 text-sm font-normal text-muted">
            Catatan pembelajaran dan perkembangan siswa.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              icon={ClipboardCheck}
              onClick={() =>
                navigate(`/teacher/class/${classSubjectId}/attendance/history`)
              }
            >
              Absensi Siswa
            </Button>

            <Button
              variant="outline"
              icon={FileText}
              onClick={() =>
                navigate(`/teacher/class/${classSubjectId}/evaluation`)
              }
            >
              Evaluasi
            </Button>
          </div>

          <Button
            variant="outline"
            icon={FileText}
            isLoading={downloadReport.isPending}
            onClick={() => downloadReport.mutate(classSubjectId)}
          >
            Cetak Laporan
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted">Memuat riwayat pembelajaran...</p>
        ) : isError ? (
          <p className="text-sm text-danger">
            Gagal memuat riwayat pembelajaran.
          </p>
        ) : (
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

            {!histories.length && (
              <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted">
                Belum ada pembelajaran yang dicatat.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClassroomPage;
