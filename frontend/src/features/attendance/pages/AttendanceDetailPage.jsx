import { useNavigate, useParams } from "react-router";
import { ArrowLeft, CalendarDays, ClipboardCheck, Pencil } from "lucide-react";

import Badge from "@/shared/ui/data-display/Badge";
import Button from "@/shared/ui/button/Button";
import Table from "@/shared/ui/data-display/Table";
import useAttendance from "../hooks/useAttendance";

const statusVariant = {
  present: "success",
  permission: "primary",
  sick: "warning",
  absent: "danger",
};

const statusLabel = {
  present: "Hadir",
  permission: "Izin",
  sick: "Sakit",
  absent: "Alpa",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const AttendanceDetailPage = () => {
  const navigate = useNavigate();
  const { classSubjectId, attendanceId } = useParams();

  const { data, isLoading, isError } = useAttendance(attendanceId);
  const attendance = data?.data;
  const basePath = `/teacher/class/${classSubjectId}/attendance`;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button
        variant="ghost"
        size="S"
        icon={ArrowLeft}
        onClick={() => navigate(`${basePath}/history`)}
        className="-ml-2"
      >
        Kembali ke Riwayat
      </Button>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat detail absensi...</p>
      ) : isError || !attendance ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-semibold text-foreground">
            Detail absensi tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-muted">
            Data yang Anda cari tidak tersedia.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted">
                <ClipboardCheck size={16} />
                <span>Absensi</span>
                <span>/</span>
                <span>Detail</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Pertemuan {attendance.meeting_number ?? "-"}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {attendance.class_subject?.classroom?.name ?? "-"} ·{" "}
                {attendance.class_subject?.subject?.name ?? "-"}
              </p>
            </div>

            <Button
              icon={Pencil}
              onClick={() => navigate(`${basePath}/${attendanceId}/edit`)}
            >
              Ubah Absensi
            </Button>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InfoCard
              icon={CalendarDays}
              label="Tanggal"
              value={formatDate(attendance.date)}
            />
            <InfoCard
              icon={ClipboardCheck}
              label="Materi"
              value={attendance.topic || "-"}
            />
            <InfoCard
              icon={ClipboardCheck}
              label="Catatan"
              value={attendance.notes || "-"}
            />
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold text-foreground">
                Kehadiran Siswa
              </h2>
              <p className="mt-1 text-sm text-muted">
                {attendance.details?.length ?? 0} siswa tercatat.
              </p>
            </div>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Siswa</Table.Head>
                  <Table.Head>NISN</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Keterangan</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {(attendance.details ?? []).map((detail) => (
                  <Table.Row key={detail.id}>
                    <Table.Cell className="font-semibold">
                      {detail.student?.full_name ?? "-"}
                    </Table.Cell>
                    <Table.Cell>{detail.student?.nisn ?? "-"}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={statusVariant[detail.status] ?? "muted"}>
                        {statusLabel[detail.status] ?? detail.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{detail.note || "-"}</Table.Cell>
                  </Table.Row>
                ))}

                {!attendance.details?.length && (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="py-10 text-center">
                      Tidak ada detail kehadiran.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </section>
        </>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 break-words font-semibold text-foreground">
        {value}
      </p>
    </div>
  </div>
);

export default AttendanceDetailPage;
