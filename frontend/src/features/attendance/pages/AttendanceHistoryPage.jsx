import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Modal from "@/shared/ui/overlay/Modal";
import Select from "@/shared/ui/form/Select";
import Tooltip from "@/shared/ui/feedback/Tooltip";
import useAttendances from "../hooks/useAttendances";
import useDeleteAttendance from "../hooks/useDeleteAttendance";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const AttendanceHistoryPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);

  const params = {};
  if (search.trim()) params.search = search.trim();
  if (month) params.month = month;

  const { data, isLoading, isError } = useAttendances(classSubjectId, params);
  const deleteMutation = useDeleteAttendance();

  const meta = data?.meta;
  const histories = data?.data ?? [];

  const totals = histories.reduce(
    (accumulator, item) => ({
      sessions: accumulator.sessions + 1,
      present: accumulator.present + (item.present ?? 0),
      permission: accumulator.permission + (item.permission ?? 0),
      sick: accumulator.sick + (item.sick ?? 0),
      absent: accumulator.absent + (item.absent ?? 0),
    }),
    { sessions: 0, present: 0, permission: 0, sick: 0, absent: 0 },
  );

  const handleDelete = () => {
    if (!attendanceToDelete) return;

    deleteMutation.mutate(attendanceToDelete.id, {
      onSuccess: () => setAttendanceToDelete(null),
    });
  };

  const basePath = `/teacher/class/${classSubjectId}/attendance`;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() => navigate(`/teacher/class/${classSubjectId}`)}
          className="-ml-2"
        >
          Kembali ke Kelas
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <ClipboardCheck size={16} />
              <span>Absensi</span>
              <span>/</span>
              <span>Riwayat</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              Riwayat Absensi
            </h1>

            <p className="mt-1 text-sm text-muted">
              {meta?.classroom?.name ?? "-"} · {meta?.subject?.name ?? "-"}
            </p>
          </div>

          <Button icon={Plus} onClick={() => navigate(`${basePath}/new`)}>
            Buat Absensi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          label="Total Pertemuan"
          value={totals.sessions}
          icon={CalendarDays}
          color="text-primary"
        />
        <SummaryCard
          label="Total Hadir"
          value={totals.present}
          icon={Users}
          color="text-success"
        />
        <SummaryCard
          label="Total Izin / Sakit"
          value={totals.permission + totals.sick}
          icon={Clock3}
          color="text-warning"
        />
        <SummaryCard
          label="Total Alpa"
          value={totals.absent}
          icon={ClipboardCheck}
          color="text-danger"
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Daftar Riwayat</h2>
            <p className="mt-1 text-sm text-muted">
              Rekap absensi setiap pertemuan pembelajaran.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="w-full sm:w-48">
              <Input
                icon={Search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari materi..."
              />
            </div>

            <Select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option value="">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted">
            Memuat riwayat absensi...
          </p>
        ) : isError ? (
          <p className="p-8 text-center text-sm text-danger">
            Gagal memuat riwayat absensi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-background/70 text-xs uppercase text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Pertemuan</th>
                  <th className="px-5 py-3.5 font-medium">Tanggal</th>
                  <th className="px-5 py-3.5 font-medium">Materi</th>
                  <th className="px-5 py-3.5 font-medium">Hadir</th>
                  <th className="px-5 py-3.5 font-medium">Izin</th>
                  <th className="px-5 py-3.5 font-medium">Sakit</th>
                  <th className="px-5 py-3.5 font-medium">Alpa</th>
                  <th className="px-5 py-3.5 text-right font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {histories.map((item) => (
                  <tr key={item.id} className="hover:bg-background/50">
                    <td className="px-5 py-4 font-medium text-foreground">
                      Pertemuan {item.meeting_number ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {item.topic || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusCount value={item.present} color="success" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusCount value={item.permission} color="info" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusCount value={item.sick} color="warning" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusCount value={item.absent} color="danger" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip label="Lihat detail absensi">
                          <Button
                            variant="ghost"
                            size="S"
                            icon={Eye}
                            iconOnly
                            onClick={() =>
                              navigate(
                                `${basePath}/history/${item.id}`,
                              )
                            }
                            aria-label={`Detail absensi ${item.id}`}
                          />
                        </Tooltip>
                        <Tooltip label="Ubah absensi">
                          <Button
                            variant="ghost"
                            size="S"
                            icon={Pencil}
                            iconOnly
                            onClick={() =>
                              navigate(`${basePath}/${item.id}/edit`)
                            }
                            aria-label={`Ubah absensi ${item.id}`}
                          />
                        </Tooltip>
                        <Tooltip label="Hapus absensi">
                          <Button
                            variant="ghost"
                            size="S"
                            icon={Trash2}
                            iconOnly
                            onClick={() => setAttendanceToDelete(item)}
                            className="hover:text-danger"
                            aria-label={`Hapus absensi ${item.id}`}
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}

                {!histories.length && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <p className="font-medium text-foreground">
                        Riwayat tidak ditemukan
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Coba ubah kata kunci atau filter bulan.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-border px-5 py-3 text-xs text-muted">
          Menampilkan {histories.length} pertemuan
        </div>
      </section>

      <Modal
        open={Boolean(attendanceToDelete)}
        onClose={() => setAttendanceToDelete(null)}
        title="Hapus absensi"
        description={
          attendanceToDelete
            ? `Absensi pertemuan ${attendanceToDelete.meeting_number ?? attendanceToDelete.id} akan dihapus.`
            : undefined
        }
        size="S"
        footer={
          <>
            <Button variant="outline" onClick={() => setAttendanceToDelete(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm text-muted">{label}</p>
      <Icon size={18} className={color} />
    </div>
    <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const StatusCount = ({ value, color }) => {
  const styles = {
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <span
      className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-xs font-semibold ${styles[color]}`}
    >
      {value ?? 0}
    </span>
  );
};

export default AttendanceHistoryPage;
