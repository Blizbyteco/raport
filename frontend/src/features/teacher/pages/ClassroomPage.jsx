import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, FileText } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import ClassBanner from "../ui/ClassBanner";
import LearningCard from "../ui/LearningCard";
import ClassSchedule from "../ui/ClassSchedule";
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
      <Button
        variant="ghost"
        size="S"
        icon={ChevronLeft}
        onClick={() => navigate("/teacher")}
        className="-ml-2"
      >
        Kembali
      </Button>

      <ClassBanner data={meta} />

      <section className="space-y-3">
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

      <div className="flex justify-end">
        <Button
          variant="outline"
          icon={FileText}
          isLoading={downloadReport.isPending}
          onClick={() => downloadReport.mutate(classSubjectId)}
        >
          Cetak Laporan
        </Button>
      </div>

      <ClassSchedule />
    </div>
  );
};

export default ClassroomPage;
