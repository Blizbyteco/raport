import { useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  AlertTriangle,
  BookOpen,
  FileText,
  GraduationCap,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import PageHeader from "@/shared/layout/PageHeader";
import SummaryCard from "../ui/SummaryCard";
import Table from "@/shared/ui/data-display/Table";
import useHomeroomClasses from "../hooks/useHomeroomClasses";
import useTeacherClassProgress from "../hooks/useTeacherClassProgress";
import useDownloadStudentReport from "../hooks/useDownloadStudeentReport";

const HomeroomMonitoringPage = () => {
  const { classId } = useParams();
  const [search, setSearch] = useState("");

  const { data: homeroomData, isLoading: homeroomLoading } =
    useHomeroomClasses();

  const homeroomClasses = homeroomData?.data ?? [];
  const selectedClass =
    homeroomClasses.find(
      (item) => String(item.classroom?.id) === String(classId),
    ) ?? homeroomClasses[0];
  const selectedClassId = selectedClass?.classroom?.id;

  const {
    data: progressData,
    isLoading: progressLoading,
    isError,
  } = useTeacherClassProgress(selectedClassId);

  const downloadReport = useDownloadStudentReport();

  const progress = progressData?.data;
  const students = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return (progress?.students ?? []).filter(
      (student) =>
        !keyword ||
        student.full_name?.toLowerCase().includes(keyword) ||
        student.nisn?.toLowerCase().includes(keyword),
    );
  }, [progress, search]);

  const classInfo = progress?.class ?? selectedClass?.classroom ?? {};
  const academicYear = progress?.academic_year ?? selectedClass?.academic_year;
  const yearLabel = academicYear
    ? `${academicYear.start_year}/${academicYear.end_year}`
    : "-";

  const getStatusClass = (status) => {
    if (status === "Sangat Baik" || status === "Baik") {
      return "bg-success text-light";
    }

    return "bg-warning text-light";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Monitoring Siswa"
        description="Pantau perkembangan pemahaman siswa dari seluruh mata pelajaran."
      />

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {classInfo.name ?? "-"}
                </h2>
                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted">
                  {yearLabel}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                Tingkat {classInfo.grade_level ?? "-"}
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                <Users className="size-4" />
                <span>{selectedClass?.student_count ?? 0} siswa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Jumlah Siswa"
          value={selectedClass?.student_count ?? 0}
          description="Siswa aktif"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Rata-rata Kelas"
          value={progress?.summary?.average ?? "-"}
          description="Pemahaman siswa"
        />
        <SummaryCard
          icon={BookOpen}
          label="Pembelajaran"
          value={progress?.summary?.total_lessons ?? 0}
          description="Pembelajaran tercatat"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Perlu Perhatian"
          value={progress?.summary?.attention_students ?? 0}
          description="Siswa"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Perkembangan Siswa
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ringkasan perkembangan siswa berdasarkan seluruh mata pelajaran.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              icon={Search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau NISN..."
            />
          </div>
        </div>

        {homeroomLoading || progressLoading ? (
          <p className="text-sm text-muted">Memuat perkembangan siswa...</p>
        ) : isError ? (
          <p className="text-sm text-danger">Gagal memuat perkembangan siswa.</p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>NISN</Table.Head>
                <Table.Head>Nama Siswa</Table.Head>
                <Table.Head>Rata-rata</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Aksi</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {students.map((student) => (
                <Table.Row key={student.id}>
                  <Table.Cell>
                    <span className="font-medium text-foreground">
                      {student.nisn}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="font-medium text-foreground">
                      {student.full_name}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {student.average ?? "-"}
                      </span>
                      <span className="text-xs text-muted">/ 100</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(student.status)}`}
                    >
                      {student.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="ghost"
                      size="S"
                      icon={FileText}
                      isLoading={downloadReport.isPending}
                      disabled={downloadReport.isPending}
                      onClick={() => downloadReport.mutate(student.id)}
                    >
                      Cetak
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}

              {!students.length && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="py-10 text-center">
                    Tidak ada siswa yang cocok.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        )}
      </section>
    </div>
  );
};

export default HomeroomMonitoringPage;
