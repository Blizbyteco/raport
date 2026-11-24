import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, FileText, Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Textarea from "@/shared/ui/form/Textarea";
import ClassBanner from "../ui/ClassBanner";
import LearningCard from "../ui/LearningCard";
import useDailyLessons from "../hooks/useDailyLessons";
import useDeleteDailyLesson from "../hooks/useDeleteDailyLesson";
import useDownloadClassroomReport from "../hooks/useDownloadClassroomReport";

// Static student data for the presence table (to be replaced with real data later)
const STUDENTS = [
  { id: 1, name: "Ahmad Naufal", nisn: "0012116001" },
  { id: 2, name: "Siti Rahayu", nisn: "0012116002" },
  { id: 3, name: "Budi Santoso", nisn: "0012116003" },
];

const PRESENCE_STATUSES = ["Sakit", "Ijin", "Alpha"];

const ClassroomPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();
  const [deletingLessonId, setDeletingLessonId] = useState(null);
  const [studentPresence, setStudentPresence] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const { data } = useDailyLessons(classSubjectId);
  const downloadReport = useDownloadClassroomReport();
  const deleteLesson = useDeleteDailyLesson();

  const meta = data?.meta ?? {};
  const histories = data?.data ?? [];

  const togglePresence = (id, status) => {
    setStudentPresence((prev) => ({ ...prev, [id]: status }));
  };

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
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-foreground">Presensi Siswa</h2>
        <p className="mt-1 text-sm text-muted">
          Pilih status presensi tiap siswa.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3.5 font-medium">NISN</th>
                <th
                  className="px-5 py-3.5 font-medium"
                  colSpan={2}
                >
                  Nama Siswa
                </th>
                <th className="px-5 py-3.5 text-right font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-background/50">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {student.nisn}
                  </td>
                  <td
                    className="px-5 py-4 font-medium text-foreground"
                    colSpan={2}
                  >
                    {student.name}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      {PRESENCE_STATUSES.map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-1.5 text-sm text-foreground"
                        >
                          <input
                            type="radio"
                            name={`presensi-${student.id}`}
                            checked={studentPresence[student.id] === status}
                            onChange={() => togglePresence(student.id, status)}
                            className="size-4 accent-primary"
                            aria-label={`Status ${status} ${student.name}`}
                          />
                          {status}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="space-y-2">
        <label
          htmlFor="evaluation-field"
          className="text-sm font-medium text-foreground"
        >
          Evaluasi
        </label>

        <Textarea
          id="evaluation-field"
          placeholder="Catat evaluasi pembelajaran (opsional)..."
          rows={3}
        />

        <div className="flex justify-end">
          <Button icon={Save} onClick={() => setIsSaved(true)}>
            Save
          </Button>
        </div>
      </div>

      {isSaved && (
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
      )}
    </div>
  );
};

export default ClassroomPage;
