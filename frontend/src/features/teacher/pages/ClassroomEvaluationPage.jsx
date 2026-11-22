import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronDown, ChevronUp, FileDown } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Select from "@/shared/ui/form/Select";
import PageHeader from "@/shared/layout/PageHeader";
import Table from "@/shared/ui/data-display/Table";
import useActiveAcademicYear from "@/features/academic-year/hooks/useActiveAcademicYear";
import useClassSubjectEvaluation from "../hooks/useClassSubjectEvaluation";
import useDownloadClassroomReport from "../hooks/useDownloadClassroomReport";

const buildMonthKeys = (academicYear) => {
  const startYear = Number(academicYear?.start_year);
  const endYear = Number(academicYear?.end_year);

  if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) return [];

  return [
    ...Array.from(
      { length: 6 },
      (_, index) => `${startYear}-${String(index + 7).padStart(2, "0")}`,
    ),
    ...Array.from(
      { length: 6 },
      (_, index) => `${endYear}-${String(index + 1).padStart(2, "0")}`,
    ),
  ];
};

const getMonthKey = (date) => (date ? date.slice(0, 7) : "");

const getMonthName = (monthKey) =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01`));

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const average = (scores) => {
  const valid = scores.filter(
    (score) => score !== null && score !== undefined,
  );

  if (!valid.length) return null;

  return Math.round(valid.reduce((total, score) => total + score, 0) / valid.length);
};

const ClassroomEvaluationPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const [period, setPeriod] = useState("monthly");
  const [month, setMonth] = useState("");
  const [semester, setSemester] = useState("ganjil");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const { data: activeYear } = useActiveAcademicYear();
  const { data, isLoading, isError } = useClassSubjectEvaluation(classSubjectId);
  const downloadReport = useDownloadClassroomReport();

  const monthKeys = useMemo(() => buildMonthKeys(activeYear), [activeYear]);
  const activeMonth = month && monthKeys.includes(month) ? month : (monthKeys[0] ?? "");

  const classroom = data?.data?.classroom ?? {};
  const allLessons = data?.data?.lessons ?? [];
  const students = data?.data?.students ?? [];

  const semesterMonths = useMemo(
    () =>
      semester === "ganjil" ? monthKeys.slice(0, 6) : monthKeys.slice(6),
    [monthKeys, semester],
  );

  const activeLessons = useMemo(() => {
    const keys = period === "monthly" ? [activeMonth] : semesterMonths;

    return allLessons.filter((lesson) => keys.includes(getMonthKey(lesson.date)));
  }, [allLessons, period, activeMonth, semesterMonths]);

  const scoresFor = (student, lessons) =>
    lessons
      .map((lesson) => {
        const index = allLessons.findIndex((item) => item.id === lesson.id);

        return index >= 0 ? student.scores?.[index] : undefined;
      })
      .filter((score) => score !== null && score !== undefined);

  const classScores = students.flatMap((student) => scoresFor(student, activeLessons));
  const classAverage = average(classScores);
  const selectedStudent = students.find(
    (student) => String(student.id) === String(selectedStudentId),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Evaluasi Pembelajaran"
        description="Rekap perkembangan pembelajaran siswa berdasarkan periode."
      />

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Periode"
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
                setSelectedStudentId(null);
              }}
            >
              <option value="monthly">Bulanan</option>
              <option value="semester">Semester</option>
            </Select>

            {period === "monthly" ? (
              <Select
                label="Bulan"
                value={activeMonth}
                disabled={!monthKeys.length}
                onChange={(event) => {
                  setMonth(event.target.value);
                  setSelectedStudentId(null);
                }}
              >
                {!monthKeys.length && (
                  <option value="">Memuat tahun akademik...</option>
                )}
                {monthKeys.map((monthKey) => (
                  <option key={monthKey} value={monthKey}>
                    {getMonthName(monthKey)}
                  </option>
                ))}
              </Select>
            ) : (
              <Select
                label="Semester"
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                  setSelectedStudentId(null);
                }}
              >
                <option value="ganjil">Ganjil</option>
                <option value="genap">Genap</option>
              </Select>
            )}
          </div>

          <Button
            icon={FileDown}
            isLoading={downloadReport.isPending}
            disabled={period === "monthly" && !activeMonth}
            onClick={() =>
              downloadReport.mutate({
                classSubjectId,
                params:
                  period === "monthly"
                    ? { period, month: activeMonth }
                    : { period, semester },
              })
            }
          >
            Cetak Laporan
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Jumlah Siswa" value={students.length} />
        <SummaryCard label="Pembelajaran" value={activeLessons.length} />
        <SummaryCard label="Rata-rata Kelas" value={classAverage ?? "-"} />
      </section>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat evaluasi...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat evaluasi.</p>
      ) : (
        <>
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border p-6">
              <h2 className="text-base font-bold text-foreground">
                Rekap Pembelajaran
              </h2>
              <p className="mt-1 text-sm text-muted">
                {classroom.subject} · {classroom.class} ·{" "}
                {classroom.academicYear}
              </p>
            </div>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="w-12 text-center">No</Table.Head>
                  <Table.Head className="min-w-[280px]">Siswa</Table.Head>
                  <Table.Head className="text-center">Pembelajaran</Table.Head>
                  <Table.Head className="text-center">Dinilai</Table.Head>
                  <Table.Head className="text-center">Rata-rata</Table.Head>
                  <Table.Head className="text-center">Detail</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {students.map((student, index) => {
                  const scores = scoresFor(student, activeLessons);
                  const isSelected =
                    String(selectedStudentId) === String(student.id);

                  return (
                    <Table.Row key={student.id}>
                      <Table.Cell className="text-center">{index + 1}</Table.Cell>
                      <Table.Cell>
                        <StudentButton
                          student={student}
                          selected={isSelected}
                          onClick={() =>
                            setSelectedStudentId(
                              isSelected ? null : student.id,
                            )
                          }
                        />
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {activeLessons.length}
                      </Table.Cell>
                      <Table.Cell className="text-center">{scores.length}</Table.Cell>
                      <Table.Cell className="text-center font-semibold">
                        {average(scores) ?? "-"}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Button
                          variant="ghost"
                          size="S"
                          onClick={() =>
                            navigate(
                              `/teacher/class/${classSubjectId}/evaluation/${student.id}`,
                            )
                          }
                        >
                          Detail
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

                {!students.length && (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="py-10 text-center">
                      Belum ada siswa pada kelas ini.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </section>

          {selectedStudent && (
            <section className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="border-b border-border p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Detail Siswa
                </p>
                <h2 className="mt-1 text-lg font-bold text-foreground">
                  {selectedStudent.name}
                </h2>
                <p className="mt-1 text-sm text-muted">NISN {selectedStudent.nis}</p>
                <p className="mt-2 text-sm text-muted">
                  Catatan: {selectedStudent.notes || "-"}
                </p>
              </div>

              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="w-12 text-center">No</Table.Head>
                    <Table.Head>Tanggal</Table.Head>
                    <Table.Head>Materi</Table.Head>
                    <Table.Head className="text-center">Nilai</Table.Head>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {activeLessons.map((lesson, index) => {
                    const globalIndex = allLessons.findIndex(
                      (item) => item.id === lesson.id,
                    );

                    return (
                      <Table.Row key={lesson.id}>
                        <Table.Cell className="text-center">{index + 1}</Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          {formatDate(lesson.date)}
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-medium text-foreground">
                            {lesson.title}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="text-center font-semibold">
                          {selectedStudent.scores?.[globalIndex] ?? "-"}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}

                  {!activeLessons.length && (
                    <Table.Row>
                      <Table.Cell
                        colSpan={4}
                        className="py-10 text-center"
                      >
                        Tidak ada pembelajaran pada periode ini.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </section>
          )}
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const StudentButton = ({ student, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-3 text-left"
  >
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted">
      {selected ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
    </span>
    <span>
      <span className="block text-sm font-medium text-foreground group-hover:text-primary">
        {student.name}
      </span>
      <span className="mt-1 block text-xs text-muted">NISN {student.nis}</span>
    </span>
  </button>
);

export default ClassroomEvaluationPage;
