import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, FileDownIcon, FileText } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Select from "@/shared/ui/form/Select";
import PageHeader from "@/shared/layout/PageHeader";
import Table from "@/shared/ui/data-display/Table";

import evaluationData from "@/shared/data/evaluationData.json";
import useDownloadClassroomReport from "../hooks/useDownloadClassroomReport";

const { classroom, lessons, students } = evaluationData;

const getMonthKey = (date) => {
  return date.slice(0, 7);
};

const getMonthName = (monthKey) => {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01`));
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getAverage = (scores) => {
  if (!scores.length) return 0;

  return Math.round(
    scores.reduce((total, score) => total + score, 0) / scores.length,
  );
};

const getStudentScoresForLessons = (student, targetLessons) => {
  return targetLessons
    .map((lesson) => {
      const index = lessons.findIndex((item) => item.id === lesson.id);

      return student.scores[index];
    })
    .filter((score) => score !== null && score !== undefined);
};

const ClassroomEvaluationPage = () => {
  const [period, setPeriod] = useState("monthly");

  const [month, setMonth] = useState("2026-09");

  const [semester, setSemester] = useState("ganjil");

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const downloadReport = useDownloadClassroomReport();

  const handleDownloadReport = () => {
    downloadReport.mutate(16);
  };

  const semesterMonths =
    semester === "ganjil"
      ? ["2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"]
      : ["2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06"];

  const activeLessons = useMemo(() => {
    if (period === "monthly") {
      return lessons.filter((lesson) => getMonthKey(lesson.date) === month);
    }

    return lessons.filter((lesson) =>
      semesterMonths.includes(getMonthKey(lesson.date)),
    );
  }, [period, month, semester]);

  const classAverage = useMemo(() => {
    const scores = [];

    students.forEach((student) => {
      scores.push(...getStudentScoresForLessons(student, activeLessons));
    });

    return getAverage(scores);
  }, [activeLessons]);

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Evaluasi Pembelajaran"
        description="Rekap perkembangan pembelajaran siswa berdasarkan periode."
      />

      {/* FILTER */}

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
                value={month}
                onChange={(event) => {
                  setMonth(event.target.value);
                  setSelectedStudentId(null);
                }}
              >
                {[
                  "2026-07",
                  "2026-08",
                  "2026-09",
                  "2026-10",
                  "2026-11",
                  "2026-12",
                  "2027-01",
                  "2027-02",
                  "2027-03",
                  "2027-04",
                  "2027-05",
                  "2027-06",
                ].map((monthKey) => (
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
                <option value="ganjil">Ganjil 2026/2027</option>

                <option value="genap">Genap 2026/2027</option>
              </Select>
            )}
          </div>

          <Button
            variant="primary"
            size="M"
            icon={FileDownIcon}
            loading={downloadReport.isPending}
            onClick={handleDownloadReport}
          >
            {downloadReport.isPending ? "Menyiapkan PDF..." : "Cetak Laporan"}
          </Button>
        </div>
      </section>

      {/* SUMMARY */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Jumlah Siswa" value={students.length} />

        <SummaryCard label="Pembelajaran" value={activeLessons.length} />

        <SummaryCard label="Rata-rata Kelas" value={classAverage || "-"} />
      </section>

      {/* MONTHLY */}

      {period === "monthly" && (
        <>
          <MonthlyEvaluation
            students={students}
            lessons={activeLessons}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />

          {selectedStudent && (
            <MonthlyStudentDetail
              student={selectedStudent}
              lessons={activeLessons}
            />
          )}
        </>
      )}

      {/* SEMESTER */}

      {period === "semester" && (
        <>
          <SemesterEvaluation
            students={students}
            lessons={activeLessons}
            semester={semester}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />

          {selectedStudent && (
            <SemesterStudentDetail
              student={selectedStudent}
              lessons={activeLessons}
              semesterMonths={semesterMonths}
            />
          )}

          {semester === "genap" && <SemesterComparison />}
        </>
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

const SummaryCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted">{label}</p>

    <p className="mt-2 text-2xl font-bold text-dark">{value}</p>
  </div>
);

/*
|--------------------------------------------------------------------------
| MONTHLY
|--------------------------------------------------------------------------
*/

const MonthlyEvaluation = ({
  students,
  lessons,
  selectedStudentId,
  onSelectStudent,
}) => (
  <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="border-b border-border p-6">
      <h2 className="text-base font-bold text-dark">
        Detail Pembelajaran Bulanan
      </h2>

      <p className="mt-1 text-sm text-muted">
        {classroom.subject} · {classroom.class}
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

          <Table.Head className="text-center">Terendah</Table.Head>

          <Table.Head className="text-center">Tertinggi</Table.Head>

          <Table.Head className="text-center">Detail</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {students.map((student, index) => {
          const scores = getStudentScoresForLessons(student, lessons);

          const isSelected = selectedStudentId === student.id;

          return (
            <Table.Row key={student.id}>
              <Table.Cell className="text-center">{index + 1}</Table.Cell>

              <Table.Cell>
                <StudentButton
                  student={student}
                  selected={isSelected}
                  onClick={() =>
                    onSelectStudent(isSelected ? null : student.id)
                  }
                />
              </Table.Cell>

              <Table.Cell className="text-center">{lessons.length}</Table.Cell>

              <Table.Cell className="text-center">{scores.length}</Table.Cell>

              <Table.Cell className="text-center font-semibold">
                {getAverage(scores) || "-"}
              </Table.Cell>

              <Table.Cell className="text-center">
                {scores.length ? Math.min(...scores) : "-"}
              </Table.Cell>

              <Table.Cell className="text-center">
                {scores.length ? Math.max(...scores) : "-"}
              </Table.Cell>

              <Table.Cell className="text-center">
                <DetailButton
                  selected={isSelected}
                  onClick={() =>
                    onSelectStudent(isSelected ? null : student.id)
                  }
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </section>
);

/*
|--------------------------------------------------------------------------
| MONTHLY DETAIL
|--------------------------------------------------------------------------
*/

const MonthlyStudentDetail = ({ student, lessons }) => (
  <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="border-b border-border p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Detail Siswa
      </p>

      <h2 className="mt-1 text-lg font-bold text-dark">{student.name}</h2>

      <p className="mt-1 text-sm text-muted">NISN {student.nis}</p>
    </div>

    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-12 text-center">No</Table.Head>

          <Table.Head>Tanggal</Table.Head>

          <Table.Head>Materi</Table.Head>

          <Table.Head className="text-center">Nilai</Table.Head>

          <Table.Head>Catatan Guru</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {lessons.map((lesson, index) => {
          const scoreIndex = lessons.findIndex((item) => item.id === lesson.id);

          const globalIndex = globalLessonIndex(lesson.id);

          return (
            <Table.Row key={lesson.id}>
              <Table.Cell className="text-center">{index + 1}</Table.Cell>

              <Table.Cell className="whitespace-nowrap">
                {formatDate(lesson.date)}
              </Table.Cell>

              <Table.Cell>
                <span className="font-medium text-dark">{lesson.title}</span>
              </Table.Cell>

              <Table.Cell className="text-center font-semibold">
                {student.scores[globalIndex] ?? "-"}
              </Table.Cell>

              <Table.Cell className="text-sm text-muted">
                {student.notes || "-"}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </section>
);

/*
|--------------------------------------------------------------------------
| SEMESTER
|--------------------------------------------------------------------------
*/

const SemesterEvaluation = ({
  students,
  lessons,
  semester,
  selectedStudentId,
  onSelectStudent,
}) => (
  <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="border-b border-border p-6">
      <h2 className="text-base font-bold text-dark">Rangkuman Semester</h2>

      <p className="mt-1 text-sm text-muted">
        {classroom.subject} · {classroom.class} ·{" "}
        {semester === "ganjil" ? "Ganjil" : "Genap"} {classroom.academicYear}
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
          const scores = getStudentScoresForLessons(student, lessons);

          const isSelected = selectedStudentId === student.id;

          return (
            <Table.Row key={student.id}>
              <Table.Cell className="text-center">{index + 1}</Table.Cell>

              <Table.Cell>
                <StudentButton
                  student={student}
                  selected={isSelected}
                  onClick={() =>
                    onSelectStudent(isSelected ? null : student.id)
                  }
                />
              </Table.Cell>

              <Table.Cell className="text-center">{lessons.length}</Table.Cell>

              <Table.Cell className="text-center">{scores.length}</Table.Cell>

              <Table.Cell className="text-center font-semibold">
                {getAverage(scores) || "-"}
              </Table.Cell>

              <Table.Cell className="text-center">
                <DetailButton
                  selected={isSelected}
                  onClick={() =>
                    onSelectStudent(isSelected ? null : student.id)
                  }
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </section>
);

/*
|--------------------------------------------------------------------------
| SEMESTER STUDENT DETAIL
|--------------------------------------------------------------------------
*/

const SemesterStudentDetail = ({ student, lessons, semesterMonths }) => (
  <section className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="border-b border-border p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Rangkuman Siswa
      </p>

      <h2 className="mt-1 text-lg font-bold text-dark">{student.name}</h2>

      <p className="mt-1 text-sm text-muted">NISN {student.nis}</p>
    </div>

    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-12 text-center">No</Table.Head>

          <Table.Head>Bulan</Table.Head>

          <Table.Head className="text-center">Pembelajaran</Table.Head>

          <Table.Head className="text-center">Dinilai</Table.Head>

          <Table.Head className="text-center">Rata-rata</Table.Head>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {semesterMonths.map((monthKey, index) => {
          const monthLessons = lessons.filter(
            (lesson) => getMonthKey(lesson.date) === monthKey,
          );

          const scores = getStudentScoresForLessons(student, monthLessons);

          return (
            <Table.Row key={monthKey}>
              <Table.Cell className="text-center">{index + 1}</Table.Cell>

              <Table.Cell className="font-medium">
                {getMonthName(monthKey)}
              </Table.Cell>

              <Table.Cell className="text-center">
                {monthLessons.length}
              </Table.Cell>

              <Table.Cell className="text-center">{scores.length}</Table.Cell>

              <Table.Cell className="text-center font-semibold">
                {getAverage(scores) || "-"}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  </section>
);

/*
|--------------------------------------------------------------------------
| SEMESTER COMPARISON
|--------------------------------------------------------------------------
*/

const SemesterComparison = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-base font-bold text-dark">
          Perbandingan Perkembangan
        </h2>

        <p className="mt-1 text-sm text-muted">
          Perbandingan rata-rata semester ganjil dan semester genap.
        </p>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12 text-center">No</Table.Head>

            <Table.Head>Siswa</Table.Head>

            <Table.Head className="text-center">Ganjil</Table.Head>

            <Table.Head className="text-center">Genap</Table.Head>

            <Table.Head className="text-center">Perubahan</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students.map((student, index) => {
            const ganjilLessons = lessons.filter((lesson) => {
              const month = Number(lesson.date.slice(5, 7));

              return month >= 7 && month <= 12;
            });

            const genapLessons = lessons.filter((lesson) => {
              const yearMonth = getMonthKey(lesson.date);

              return yearMonth >= "2027-01" && yearMonth <= "2027-06";
            });

            const ganjilAverage = getAverage(
              getStudentScoresForLessons(student, ganjilLessons),
            );

            const genapAverage = getAverage(
              getStudentScoresForLessons(student, genapLessons),
            );

            const difference = genapAverage - ganjilAverage;

            return (
              <Table.Row key={student.id}>
                <Table.Cell className="text-center">{index + 1}</Table.Cell>

                <Table.Cell>
                  <p className="text-sm font-medium text-dark">
                    {student.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">NISN {student.nis}</p>
                </Table.Cell>

                <Table.Cell className="text-center">{ganjilAverage}</Table.Cell>

                <Table.Cell className="text-center">{genapAverage}</Table.Cell>

                <Table.Cell className="text-center">
                  <span className="font-semibold text-dark">
                    {difference > 0 ? "+" : ""}
                    {difference}
                  </span>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </section>
  );
};

/*
|--------------------------------------------------------------------------
| SMALL COMPONENTS
|--------------------------------------------------------------------------
*/

const StudentButton = ({ student, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center gap-3 text-left"
  >
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted">
      {selected ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
    </span>

    <span>
      <span className="block text-sm font-medium text-dark group-hover:text-primary">
        {student.name}
      </span>

      <span className="mt-1 block text-xs text-muted">NISN {student.nis}</span>
    </span>
  </button>
);

const DetailButton = ({ selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-sm font-medium text-primary hover:underline"
  >
    {selected ? "Tutup" : "Lihat"}
  </button>
);

const globalLessonIndex = (lessonId) => {
  return lessons.findIndex((lesson) => lesson.id === lessonId);
};

export default ClassroomEvaluationPage;
