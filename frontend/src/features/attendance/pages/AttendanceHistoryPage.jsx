import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Eye,
  Plus,
  Search,
  Users,
} from "lucide-react";

const mockMeta = {
  class_name: "X RPL 1",
  subject_name: "Matematika",
  teacher_name: "Budi Santoso, S.Pd.",
};

const mockHistory = [
  {
    id: 1,
    date: "2026-09-24",
    meeting_number: 5,
    topic: "Persamaan Kuadrat",
    total_students: 30,
    present: 27,
    permission: 1,
    sick: 1,
    absent: 1,
  },
  {
    id: 2,
    date: "2026-09-22",
    meeting_number: 4,
    topic: "Fungsi Kuadrat",
    total_students: 30,
    present: 28,
    permission: 1,
    sick: 1,
    absent: 0,
  },
  {
    id: 3,
    date: "2026-09-17",
    meeting_number: 3,
    topic: "Persamaan Linear",
    total_students: 30,
    present: 29,
    permission: 0,
    sick: 1,
    absent: 0,
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const AttendanceHistoryPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");

  const histories = useMemo(() => {
    return mockHistory.filter((item) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(search.toLowerCase()) ||
        String(item.meeting_number).includes(search);

      const matchesMonth = month === "all" || item.date.slice(5, 7) === month;

      return matchesSearch && matchesMonth;
    });
  }, [search, month]);

  const totals = mockHistory.reduce(
    (acc, item) => ({
      sessions: acc.sessions + 1,
      present: acc.present + item.present,
      permission: acc.permission + item.permission,
      sick: acc.sick + item.sick,
      absent: acc.absent + item.absent,
    }),
    { sessions: 0, present: 0, permission: 0, sick: 0, absent: 0 },
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(`/classroom/${classSubjectId}`)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Kembali ke Kelas
        </button>

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
              {mockMeta.class_name} · {mockMeta.subject_name}
            </p>
          </div>

          <button
            onClick={() => navigate(`/classroom/${classSubjectId}/attendance`)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={17} />
            Buat Absensi
          </button>
        </div>
      </div>

      {/* Summary */}
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

      {/* History table */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Daftar Riwayat</h2>
            <p className="mt-1 text-sm text-muted">
              Rekap absensi setiap pertemuan pembelajaran.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari materi..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary sm:w-48"
              />
            </div>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Semua Bulan</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
        </div>

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
                    Pertemuan {item.meeting_number}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.topic}
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
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/classroom/${classSubjectId}/attendance/history/${item.id}`,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-background"
                    >
                      <Eye size={15} />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}

              {histories.length === 0 && (
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

        <div className="border-t border-border px-5 py-3 text-xs text-muted">
          Menampilkan {histories.length} dari {mockHistory.length} pertemuan
        </div>
      </section>
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
      {value}
    </span>
  );
};

export default AttendanceHistoryPage;
