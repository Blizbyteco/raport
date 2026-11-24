import {
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Users,
} from "lucide-react";

import PageHeader from "@/shared/layout/PageHeader";

const PRESENCE_CLASSES = [
  {
    id: 101,
    name: "XII IPA 1",
    sessions: 5,
    present: 26,
    permission: 1,
    sick: 2,
    absent: 1,
  },
  {
    id: 102,
    name: "XII IPA 2",
    sessions: 4,
    present: 23,
    permission: 0,
    sick: 1,
    absent: 2,
  },
  {
    id: 103,
    name: "XII BInd 1",
    sessions: 3,
    present: 24,
    permission: 2,
    sick: 0,
    absent: 1,
  },
];

const PresenceReport = () => {
  const totals = PRESENCE_CLASSES.reduce(
    (acc, item) => ({
      sessions: acc.sessions + item.sessions,
      present: acc.present + item.present,
      permission: acc.permission + item.permission,
      sick: acc.sick + item.sick,
      absent: acc.absent + item.absent,
    }),
    { sessions: 0, present: 0, permission: 0, sick: 0, absent: 0 },
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Laporan Presensi"
        description="Rekap presensi tiap kelas yang Anda ajar."
      />

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

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold text-foreground">Rekap Kelas</h2>
          <p className="mt-1 text-sm text-muted">
            Presensi per kelas tiap pertemuan pembelajaran.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-background/70 text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3.5 font-medium">Kelas</th>
                <th className="px-5 py-3.5 font-medium">Pertemuan</th>
                <th className="px-5 py-3.5 font-medium">Hadir</th>
                <th className="px-5 py-3.5 font-medium">Izin</th>
                <th className="px-5 py-3.5 font-medium">Sakit</th>
                <th className="px-5 py-3.5 font-medium">Alpa</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {PRESENCE_CLASSES.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 text-muted">{item.sessions}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
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

export default PresenceReport;
