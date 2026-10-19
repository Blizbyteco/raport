import {
  AlertTriangle,
  ArrowRight,
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

import monitoringData from "@/shared/data/monitoringData";
import useDownloadStudentReport from "../hooks/useDownloadStudeentReport";

const HomeroomMonitoringPage = () => {
  const { mutate: downloadReport, isPending } = useDownloadStudentReport();

  const handleDownload = (studentId) => {
    downloadReport(studentId);
  };

  const getStatusClass = (status) => {
    if (status === "Sangat Baik") {
      return "bg-success text-light";
    }

    if (status === "Baik") {
      return "bg-success/70 text-light";
    }

    return "bg-warning text-light";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Monitoring Siswa"
        description="Pantau perkembangan pemahaman siswa dari seluruh mata pelajaran."
      />

      {/* Class Header */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">
                  {monitoringData.class.name}
                </h2>

                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted">
                  {monitoringData.class.academicYear}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted">
                {monitoringData.class.major}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                <Users className="h-4 w-4" />
                <span>{monitoringData.class.studentCount} siswa</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" icon={FileText}>
              Laporan Kelas
            </Button>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Jumlah Siswa"
          value={monitoringData.class.studentCount}
          description="Siswa aktif"
        />

        <SummaryCard
          icon={TrendingUp}
          label="Rata-rata Kelas"
          value={monitoringData.summary.average}
          description="Pemahaman siswa"
        />

        <SummaryCard
          icon={BookOpen}
          label="Pembelajaran"
          value={monitoringData.summary.totalLessons}
          description="Pembelajaran tercatat"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Perlu Perhatian"
          value={monitoringData.summary.attentionStudents}
          description="Siswa"
        />
      </section>

      {/* Student List */}
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
            <Input icon={Search} placeholder="Cari nama atau NISN..." />
          </div>
        </div>

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
            {monitoringData.students.map((student) => (
              <Table.Row key={student.id}>
                <Table.Cell>
                  <span className="font-medium text-dark">{student.nisn}</span>
                </Table.Cell>

                <Table.Cell>
                  <p className="font-medium text-dark">{student.name}</p>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark">
                      {student.average}
                    </span>

                    <span className="text-xs text-muted">/ 100</span>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      student.status,
                    )}`}
                  >
                    {student.status}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>
                      Detail
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FileText}
                      loading={isPending}
                      disabled={isPending}
                      onClick={() => handleDownload(student.id)}
                    >
                      Cetak
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </section>
    </div>
  );
};

export default HomeroomMonitoringPage;
